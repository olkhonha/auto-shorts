import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  try {
    const { productIds, products } = await request.json();
    
    // 환경변수 체크
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ success: false, error: '서버에 API 키가 설정되지 않았습니다.' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const newScripts: any = {};

    // Promise.all로 병렬 처리하여 대본 생성 시간 단축
    await Promise.all(productIds.map(async (id: number) => {
      const prod = products.find((p: any) => p.id === id);
      if (prod) {
        const prompt = `
당신은 최고의 숏폼(틱톡, 유튜브 쇼츠) 전문 대본 작가이자 크리에이터입니다.
다음 상품의 정보를 바탕으로, 즉각적으로 조회수를 폭발시킬 수 있는 숏폼 영상 대본을 기획해주세요.

[상품 정보]
이름: ${prod.name}
가격: ${prod.price}
출처: ${prod.source}
특징/트렌드: ${prod.trend}

[요구사항]
- 친근하고 에너지가 넘치며 후킹(Hooking)이 강한 "리뷰어/틱톡커" 톤으로 작성하세요.
- 결과물은 반드시 아래와 같은 구조의 JSON 포맷으로 "오직 JSON 문자열"만 출력하세요. 마크다운 기호(\`\`\`json)는 절대 포함하지 마세요.

{
  "title": "클릭을 유도하는 자극적이고 재밌는 영상 제목",
  "hook": "영상의 처음 3초를 사로잡는 강력한 도입부 대본",
  "body": "상품의 장점과 특징을 빠르고 리듬감 있게 설명하는 본문 대본",
  "cta": "시청자가 댓글 창이나 프로필 링크를 클릭해서 상품을 구매하도록 하거나 구독을 유도하는 마무리 대본"
}
`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });

        if (response.text) {
          try {
             const scriptData = JSON.parse(response.text);
             newScripts[id] = scriptData;
          } catch (err) {
             console.error("JSON 파싱 에러:", err);
             // 파싱 실패시 폴백
             newScripts[id] = {
               title: `[에러 복구됨] ${prod.name}`,
               hook: "AI 응답 처리 중 형식이 어긋났습니다. 하지만 이 상품은 강력 추천합니다!",
               body: "가성비가 좋은 제품입니다.",
               cta: "지금 바로 확인해보세요!"
             };
          }
        }
      }
    }));

    return NextResponse.json({ success: true, scripts: newScripts });
    
  } catch (error: any) {
    console.error("Gemini 연동 에러:", error);
    return NextResponse.json({ success: false, error: error.message || '서버 보안 통신 에러' }, { status: 500 });
  }
}

