import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { productIds, products } = await request.json();
    
    // 이 위치에 서버 상에서만 동작하는 (핵심 알고리즘) 프라이빗 프롬프트 및 Gemini 호출 로직이 들어갑니다.
    // process.env.GEMINI_API_KEY 를 사용하며 클라이언트에는 유출되지 않습니다.
    
    // 시뮬레이션을 위함 (2초 대기)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newScripts: any = {};
    
    productIds.forEach((id: number) => {
      const prod = products.find((p: any) => p.id === id);
      if (prod) {
        newScripts[id] = {
          title: `[보안 생성] ${prod.name} - 무조건 사야하는 이유`,
          hook: "지금 당장 사지 않으면 후회할 역대급 가성비 템 하나 가져왔습니다. 3초만 보세요.",
          body: `이 ${prod.name}, 진짜 혁신입니다. 리뷰만 수만 개인데 평점이 4.9예요. 직접 써보니 왜 난리인지 알겠습니다. 성능은 미쳤고 가격은 ${prod.price}밖에 안합니다.`,
          cta: "지금 고정 댓글 링크에서 한정 수량 특가 진행 중이니 품절 전에 확인하세요!"
        };
      }
    });

    return NextResponse.json({ success: true, scripts: newScripts });
    
  } catch (error) {
    return NextResponse.json({ success: false, error: '서버 보안 통신 에러' }, { status: 500 });
  }
}
