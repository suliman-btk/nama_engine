from pathlib import Path
from zipfile import ZipFile
import base64,json,html
root=Path(__file__).resolve().parents[3]
lesson=root/'lessons/lesson-01';assets=lesson/'assets/new-master';assets.mkdir(parents=True,exist_ok=True)
staged=root/'production/act-engine/public/lesson-assets/lesson-01';staged.mkdir(parents=True,exist_ok=True)
selection=[(24,'image30.jpeg','aircraft','A technical problem',['Imagine the trip.','Which zone are you in?'],1920,1080),(25,'image31.jpeg','parachute','Jump with a parachute',['Comfort, challenge,','or pain?'],1875,982),(26,'image32.jpeg','shark','Dive where there are sharks',['Notice your reaction.','Which zone feels right?'],1200,800),(27,'image33.jpeg','meal','An unfamiliar meal',['Unknown ingredients.','Which zone feels right?'],771,416)]
manifest=[]
with ZipFile(root/'source-material/ACT Lessons Updated Logo.pptx') as deck:
 for slide,filename,key,title,lines,width,height in selection:
  data=deck.read('ppt/media/'+filename);(assets/filename).write_bytes(data)
  display_width=720;display_height=display_width*height/width;y=280+(480-display_height)/2
  body=f'<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200" viewBox="0 0 800 1200"><rect width="800" height="1200" fill="#faf7ee"/><text x="400" y="155" text-anchor="middle" font-family="Arial" font-size="42" font-weight="bold" fill="#191c44">{html.escape(title)}</text><image x="40" y="{y}" width="720" height="{display_height}" preserveAspectRatio="xMidYMid meet" href="data:image/jpeg;base64,{base64.b64encode(data).decode()}"/>'
  for i,line in enumerate(lines):body+=f'<text x="400" y="{870+i*65}" text-anchor="middle" font-family="Arial" font-size="40" fill="#191c44">{html.escape(line)}</text>'
  body+='</svg>';name=key+'.svg';(assets/name).write_text(body);(staged/name).write_text(body)
  manifest.append({'file':name,'originalFile':filename,'source':'ACT Lessons Updated Logo.pptx','slide':slide,'originalDimensions':[width,height],'treatment':'Original photograph contained at preserved aspect ratio inside a vector typeset scenario card; no essential image labels cropped; no raster upscaling.'})
 clip=deck.read('ppt/media/media1.mp4');(lesson/'generated/lesson-01-panyee.mp4').write_bytes(clip)
manifest.append({'file':'lesson-01-panyee.mp4','source':'ACT Lessons Updated Logo.pptx','slide':31,'embeddedPath':'ppt/media/media1.mp4','treatment':'Unmodified companion activity video, separate from original narration.'})
(lesson/'generated/asset-manifest.json').write_text(json.dumps({'assets':manifest,'licence':'Provided official curriculum; no separate licence claimed'},indent=2))
print('Prepared four native-aspect official visuals and curriculum activity clip')
