import { createElement as h } from 'react';
import { ImageResponse } from 'next/og';
import { writeFileSync } from 'node:fs';
import { TypeMark } from '../components/TypeMarkView';
import { cardFonts } from '../components/cardFont';

const names = ['새싹 친구', '하트 친구', '별 친구', '베레모 친구', '안경 친구', '토끼 친구', '반짝 친구', '곰 친구', '구름 친구'];
async function main() {
  const response = new ImageResponse(h('div', { style: { display:'flex', flexDirection:'column', width:960, height:1110, background:'#faf8f3', padding:48, color:'#51433e', fontFamily:'Pretendard' } },
    h('div', {style:{fontSize:32,fontWeight:700}}, '마음에 드는 친구를 골라 주세요'),
    h('div', {style:{fontSize:18,marginTop:12,color:'#8b8079'}}, '캐릭터 시안 · 번호로 선택해 주세요'),
    h('div', {style:{display:'flex',flexWrap:'wrap',marginTop:32,gap:18}}, ...names.map((name,i)=>h('div', {key:i,style:{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',width:276,height:280,background:'#ffffff',borderRadius:28}},
      h(TypeMark,{typeId:i+1,dot:12}), h('div',{style:{fontSize:21,marginTop:12}},`${i+1}. ${name}`)
    )))
  ), {width:960,height:1110,fonts:cardFonts});
  writeFileSync('_workspace/character-options.png',Buffer.from(await response.arrayBuffer()));
}
main().catch(e=>{console.error(e);process.exit(1)});
