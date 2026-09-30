export const workshopDefaults={thickness:22,xWidthOneDoor:1.7,xWidthTwoDoors:3.4,xHeight:0,resinInset:53};
export function calculateBox({length,height,depth,shelves=0,doors=0,topResin=true,overrides={}}){
 const L=Number(length),H=Number(height),D=Number(depth),nShelves=Number(shelves),nDoors=Number(doors); const s={...workshopDefaults,...overrides};
 const oneDepart=2*L+2*H, longDepart=2*L+4*D, shortDepart=2*H;
 const resinSide=2*((H-s.resinInset)/1000)*((D-s.resinInset)/1000), resinBack=((H-s.resinInset)/1000)*((L-s.resinInset)/1000), resinBottom=((D-s.resinInset)/1000)*((L-s.resinInset)/1000), shelfResin=nShelves*(L/1000)*(D/1000), top=topResin?(L/1000)*(D/1000):0;
 const facade=L-s.thickness, xw=nDoors===1?s.xWidthOneDoor:nDoors===2?s.xWidthTwoDoors:0, doorWidth=nDoors?(facade-xw)/nDoors:0, doorHeight=nDoors?H-s.xHeight:0;
 return {profiles:{oneDepart,longDepart,shortDepart},resin:{side:resinSide,back:resinBack,bottom:resinBottom,shelves:shelfResin,top,total:resinSide+resinBack+resinBottom+shelfResin+top},shelves:{count:nShelves,oneDepartLengthPieces:nShelves*2,oneDepartDepthPieces:nShelves*2,coinPieces:nShelves*4},doors:{count:nDoors,width:doorWidth,height:doorHeight,alucoArea:nDoors*doorWidth*doorHeight/1e6,ouvrantLengthPieces:nDoors*2,ouvrantHeightPieces:nDoors*2,hinges:nDoors*2}};
}
