import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const itemEmotions: Record<string, string> = {
  'lantern': '安全感/指引',
  'radio': '怀旧/声音敏感',
  'pillow': '疲惫/渴望包围',
  'telescope': '好奇/探索欲',
  'flower': '生命力/自然感知',
  'journal': '秩序感/反思',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userItems, dailyInteraction, timeOfDay, seed } = body;

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // 构建提示词
    const prompt = buildPrompt(userItems, dailyInteraction, timeOfDay, seed);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // 解析返回的JSON
    const jsonMatch = text.match(/\{[^}]*\}/s);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const advice = JSON.parse(jsonMatch[0]);
    return NextResponse.json(advice);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate advice',
        fallback: generateFallbackAdvice()
      },
      { status: 500 }
    );
  }
}

function buildPrompt(userItems: string[], interaction: any, timeOfDay: string, seed: number) {
  const itemDescriptions = userItems.map(item => itemEmotions[item] || item).join('、');

  let interactionContext = '';
  if (interaction.type === 'slider') {
    interactionContext = `用户当前状态：${interaction.label}${interaction.value}%`;
  } else if (interaction.type === 'choice') {
    interactionContext = `用户选择了：${interaction.choice}`;
  } else if (interaction.type === 'senses') {
    interactionContext = `用户感知偏好：${interaction.sense} - ${interaction.choice}`;
  }

  return `你是一位专业的心理健康引导师。请根据以下信息，生成3条个性化的心理调适建议。

用户长期偏好（通过选择物品体现）：${itemDescriptions}

${interactionContext}

当前时间：${timeOfDay}

要求：
1. 输出必须是合法的JSON格式，包含三个字段：physical（身体层建议）、sensory（感官层建议）、awareness（意识层建议）
2. 建议要贴合用户的隐含情感需求，不要直接解释物品的象征意义
3. 语言要温柔、诗意、不评判，像一位沉默的管家在说话
4. 每条建议控制在50字以内
5. 避免使用"你应该"等指令性词汇

示例输出格式：
{
  "physical": "摸摸左手的指尖，像第一次发现它那样。",
  "sensory": "空气里有没有一丝熟悉的味道，悄悄记住它。",
  "awareness": "此刻的呼吸，比昨天的更深了一点。"
}`;
}

function generateFallbackAdvice() {
  const advicePool = [
    {
      physical: "转转肩膀，让骨头自己找到舒服的角度。",
      sensory: "听一听环境里最微弱的声音，它在说什么。",
      awareness: "这个瞬间，和宇宙的其他角落一样珍贵。"
    },
    {
      physical: "闭眼三秒，睁眼时像第一次看见这个空间。",
      sensory: "指尖划过桌面，感受那些看不见的纹理。",
      awareness: "情绪像云，来了也会走，天空始终在那里。"
    },
    {
      physical: "深呼吸，让空气抵达平时忽略的身体角落。",
      sensory: "有没有一束光，悄悄落在某个物体上？",
      awareness: "此刻的你，值得被温柔对待。"
    }
  ];

  return advicePool[Math.floor(Math.random() * advicePool.length)];
}