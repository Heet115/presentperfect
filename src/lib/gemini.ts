import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface QuizData {
  age: string;
  gender: string;
  interests: string[];
  personality: string;
  budget: string;
  occasion: string;
  relationship: string;
  quizMode?: 'quick' | 'detailed';
}

export interface GiftSuggestion {
  title: string;
  description: string;
  reasoning: string;
}

export async function generateGiftSuggestions(
  quizData: QuizData
): Promise<GiftSuggestion[]> {
  const isDetailed = quizData.quizMode === 'detailed';
  const numSuggestions = isDetailed ? 7 : 5;
  
  const prompt = `
    Based on the following information about a gift recipient, suggest ${numSuggestions} creative and thoughtful gift ideas:
    
    Age: ${quizData.age}
    Gender: ${quizData.gender}
    Interests: ${quizData.interests.join(", ")}
    Personality: ${quizData.personality}
    Budget: ${quizData.budget}
    Occasion: ${quizData.occasion}
    Relationship to recipient: ${quizData.relationship}
    
    For each gift suggestion, provide:
    1. A concise title (2-4 words)
    2. A detailed description of the gift
    3. A thoughtful explanation of why this gift matches their personality and interests
    
    Return ONLY a valid JSON array of objects with this exact structure:
    [
      {
        "title": "Gift Title",
        "description": "Detailed description of the gift and what makes it special",
        "reasoning": "Why this gift is perfect for them based on their personality, interests, and your relationship"
      }
    ]
    
    No markdown formatting or code blocks. Make each reasoning personal and specific to their traits.
  `;

  try {
    // Use Gemini 2.5 Flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Remove any accidental markdown
    const cleanText = text
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    // Try parsing the clean JSON
    const suggestions = JSON.parse(cleanText);
    return Array.isArray(suggestions) ? suggestions : getFallbackSuggestions(quizData);
  } catch (error) {
    console.error("Error generating gift suggestions:", error);
    return getFallbackSuggestions(quizData);
  }
}

export async function generateGiftCardMessage(
  giftTitle: string,
  giftDescription: string,
  recipientName: string,
  occasion: string,
  relationship: string,
  senderName?: string
): Promise<string> {
  const prompt = `
    Write a heartfelt, personalized greeting card message for a gift. Here are the details:
    
    Gift: ${giftTitle} - ${giftDescription}
    Recipient: ${recipientName}
    Occasion: ${occasion}
    Relationship: ${relationship}
    Sender: ${senderName || 'the gift giver'}
    
    Write a warm, thoughtful message that:
    1. Mentions the occasion
    2. Explains why this gift was chosen for them
    3. Expresses genuine care and thoughtfulness
    4. Keeps an appropriate tone for the relationship
    5. Is 2-4 sentences long
    
    Return ONLY the message text, no quotes or formatting.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Error generating gift card message:", error);
    return `Happy ${occasion}! I thought you'd love this ${giftTitle.toLowerCase()} because it perfectly matches your personality. Hope it brings you joy! 💝`;
  }
}

function getFallbackSuggestions(quizData: QuizData): GiftSuggestion[] {
  return [
    {
      title: "Hobby Gift",
      description: `A ${quizData.budget.toLowerCase()} gift related to ${quizData.interests[0] || "their hobbies"}`,
      reasoning: `Since they love ${quizData.interests[0] || "their hobbies"}, this gift aligns perfectly with their passions and shows you pay attention to what matters to them.`
    },
    {
      title: "Personalized Present",
      description: `A personalized ${quizData.occasion.toLowerCase()} gift that matches their ${quizData.personality.toLowerCase()} personality`,
      reasoning: `Their ${quizData.personality.toLowerCase()} nature means they'll appreciate something made just for them, especially for this special ${quizData.occasion.toLowerCase()}.`
    },
    {
      title: "Thoughtful Choice",
      description: `Something thoughtful for a ${quizData.relationship.toLowerCase()} in the ${quizData.age} age range`,
      reasoning: `As your ${quizData.relationship.toLowerCase()}, they deserve something that reflects the care and thought you put into your relationship.`
    },
    {
      title: "Interest Combo",
      description: `A creative gift that combines their love for ${quizData.interests.slice(0, 2).join(" and ") || "their interests"}`,
      reasoning: `By combining multiple interests, this gift shows you understand the full scope of what they enjoy and care about.`
    },
    {
      title: "Experience Gift",
      description: `An experience or item perfect for someone who is ${quizData.personality.toLowerCase()} and enjoys ${quizData.interests[0] || "new experiences"}`,
      reasoning: `Their ${quizData.personality.toLowerCase()} personality means they'll love something that creates memories and aligns with their interest in ${quizData.interests[0] || "new experiences"}.`
    }
  ];
}
