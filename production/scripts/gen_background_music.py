#!/usr/bin/env python3
"""
Generate a warm, original, royalty-free ambient background bed for the course.

Not a download, not a sample library, not a paid service — pure synthesis, so
there is no licensing question and no cost. Deterministic (fixed seed): running
this again reproduces the exact same file, so the .wav itself is gitignored
like the rest of the project's audio and rebuilt from this script when needed,
same pattern as narration/visemes.

Musically: a slow four-chord pad progression (I-vi-IV-V in D major - warm,
a little hopeful, not sad and not corporate-neutral), each chord built from a
few detuned sine harmonics for warmth plus a soft sub-bass root, a very sparse
quiet pluck motif for a touch of life, and gentle stereo width from a short
detuned delay. The loop is bookended by true silence on both ends so it can
tile forever under `<Audio loop>` with no audible seam or click.

USAGE:
    python gen_background_music.py

Writes shared/music/act-ambient-bed.wav (48kHz stereo, ~44s loop).
"""
import numpy as np
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "shared" / "music" / "act-ambient-bed.wav"
OUT.parent.mkdir(parents=True, exist_ok=True)

SR = 48000
rng = np.random.default_rng(20260826)  # fixed seed -> deterministic output

# D major: I(D) - vi(Bm) - IV(G) - V(A), each a 7th/9th voicing for warmth
NOTE = {
    "D2": 73.42, "A2": 110.00, "B1": 61.74, "G1": 49.00,
    "D3": 146.83, "F#3": 185.00, "A3": 220.00, "C#4": 277.18,
    "B2": 123.47, "D4": 293.66, "F#4": 369.99,
    "G2": 98.00, "B3": 246.94, "D5": 587.33, "E4": 329.63,
    "A3b": 220.00, "C4": 261.63, "E3": 164.81,
}
CHORDS = [
    {"bass": "D2",  "voices": ["D3", "F#3", "A3", "C#4"]},   # Dmaj7
    {"bass": "B1",  "voices": ["B2", "D4", "F#4", "A3"]},    # Bm7
    {"bass": "G1",  "voices": ["G2", "B3", "D5", "E4"]},     # Gmaj9(no3 doubled)
    {"bass": "A2",  "voices": ["A3", "C4", "E4", "B3"]},     # Asus/A9
]

CHORD_LEN = 9.5     # seconds each chord is felt (with long overlapping tails)
ATTACK = 3.0
RELEASE = 5.5
GAP_AT_LOOP = 2.0   # true silence at the very start/end so the loop tiles cleanly

TOTAL = GAP_AT_LOOP + len(CHORDS) * CHORD_LEN + RELEASE + GAP_AT_LOOP
N = int(TOTAL * SR)


def pad_tone(freq, start_s, dur_s, attack, release, level, detune_cents=6):
    """A warm pad note: fundamental + quiet 2nd harmonic, each as a close
    detuned pair (beating slightly, like a chorus), inside an attack/release
    envelope. Returns a full-length mono buffer positioned in time."""
    buf = np.zeros(N)
    n0 = int(start_s * SR)
    n1 = min(N, int((start_s + dur_s) * SR))
    if n1 <= n0:
        return buf
    t = np.arange(n1 - n0) / SR
    dlen = n1 - n0

    a_n = max(1, int(attack * SR))
    r_n = max(1, int(release * SR))
    env = np.ones(dlen)
    env[:min(a_n, dlen)] = np.linspace(0, 1, min(a_n, dlen)) ** 1.7
    if dlen > r_n:
        env[-r_n:] = np.linspace(1, 0, r_n) ** 1.7
    else:
        env *= np.linspace(1, 0, dlen) ** 1.7

    detune = 2 ** (detune_cents / 1200)
    sig = (
        np.sin(2 * np.pi * freq * t) * 0.55
        + np.sin(2 * np.pi * freq * detune * t) * 0.45
        + np.sin(2 * np.pi * freq * 2.0 * t) * 0.12  # soft 2nd harmonic, warmth
    )
    # slow amplitude shimmer so a held chord doesn't feel static
    shimmer = 1.0 + 0.04 * np.sin(2 * np.pi * 0.13 * t + rng.uniform(0, 6.28))
    buf[n0:n1] = sig * env * shimmer * level
    return buf


def sub_bass(freq, start_s, dur_s, level=0.5):
    return pad_tone(freq, start_s, dur_s, ATTACK * 1.3, RELEASE * 1.1, level, detune_cents=0)


def pluck(freq, start_s, level=0.18):
    """A soft, fast-decaying sine 'sparkle' note - a little life, kept quiet."""
    buf = np.zeros(N)
    dur_s = 3.2
    n0 = int(start_s * SR)
    n1 = min(N, int((start_s + dur_s) * SR))
    if n1 <= n0:
        return buf
    t = np.arange(n1 - n0) / SR
    env = np.exp(-t * 1.6)
    sig = np.sin(2 * np.pi * freq * t) * 0.7 + np.sin(2 * np.pi * freq * 2 * t) * 0.15
    buf[n0:n1] = sig * env * level
    return buf


left = np.zeros(N)
right = np.zeros(N)

t_cursor = GAP_AT_LOOP
for i, chord in enumerate(CHORDS):
    start = t_cursor
    dur = CHORD_LEN + RELEASE * 0.6  # overlap into the next chord for a smooth pad
    bass = sub_bass(NOTE[chord["bass"]], start, dur, level=0.34)
    voice_bufs = [
        pad_tone(NOTE[v], start, dur, ATTACK, RELEASE, level=0.16, detune_cents=5 + j * 3)
        for j, v in enumerate(chord["voices"])
    ]
    mono = bass + sum(voice_bufs)
    # gentle stereo width: right channel gets a short detuned/delayed copy
    delay_n = int(0.021 * SR)
    right_copy = np.zeros(N)
    right_copy[delay_n:] += mono[: N - delay_n] * 0.9
    left += mono
    right += right_copy + mono * 0.15

    # a couple of quiet, sparse plucks per chord for a touch of life -
    # never on the beat, never predictable
    n_plucks = rng.integers(1, 3)
    for _ in range(n_plucks):
        offset = rng.uniform(1.5, CHORD_LEN - 1.0)
        note = rng.choice(chord["voices"])
        p = pluck(NOTE[note] * 2, start + offset, level=rng.uniform(0.10, 0.16))
        pan = rng.uniform(0.35, 0.65)
        left += p * (1 - pan) * 1.3
        right += p * pan * 1.3

    t_cursor += CHORD_LEN

# very faint air/atmosphere: heavily low-passed noise, almost subliminal
noise = rng.normal(0, 1, N)
kernel = np.ones(400) / 400  # crude low-pass via moving average
air = np.convolve(noise, kernel, mode="same") * 0.010
env_air = np.ones(N)
fade = int(GAP_AT_LOOP * SR)
env_air[:fade] = np.linspace(0, 1, fade)
env_air[-fade:] = np.linspace(1, 0, fade)
left += air * env_air
right += air * env_air

# hard-silence the true loop boundaries so <Audio loop> tiles with no click
fade_n = int(0.6 * SR)
left[:fade_n] *= np.linspace(0, 1, fade_n)
right[:fade_n] *= np.linspace(0, 1, fade_n)
left[-fade_n:] *= np.linspace(1, 0, fade_n)
right[-fade_n:] *= np.linspace(1, 0, fade_n)

stereo = np.stack([left, right], axis=1)
peak = np.max(np.abs(stereo))
target_peak = 10 ** (-16 / 20)  # sits quietly under narration; engine mixes it lower still
stereo = stereo / max(peak, 1e-9) * target_peak
pcm = np.clip(stereo * 32767, -32768, 32767).astype(np.int16)

with wave.open(str(OUT), "wb") as f:
    f.setnchannels(2)
    f.setsampwidth(2)
    f.setframerate(SR)
    f.writeframes(pcm.tobytes())

print(f"wrote {OUT}  ({TOTAL:.1f}s loop, {OUT.stat().st_size/1024:.0f} KB)")
