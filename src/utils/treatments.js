const TREATMENTS = [
  {
    id: 'tomato_early_blight',
    keywords: ['Tomato___Early_blight', 'Early_blight', 'Alternaria'],
    title: 'Tomato Early Blight',
    description:
      'Caused by the fungus Alternaria solani, Early Blight appears as dark, concentric spots on older leaves and can spread rapidly in warm, humid conditions.',
    steps: [
      'Remove and destroy infected leaves immediately to reduce spore spread.',
      'Apply a copper-based fungicide or chlorothalonil every 7–14 days.',
      'Ensure adequate plant spacing for better airflow.',
      'Avoid overhead watering; water at soil level to keep foliage dry.',
      'Rotate crops and avoid planting tomatoes in the same spot for at least 3 years.',
    ],
  },
  {
    id: 'tomato_late_blight',
    keywords: ['Tomato___Late_blight', 'Late_blight', 'Phytophthora'],
    title: 'Tomato Late Blight',
    description:
      'A devastating water mold (Phytophthora infestans) that thrives in cool, wet weather, forming grey-green water-soaked lesions that rapidly turn brown.',
    steps: [
      'Remove and destroy all infected plant material immediately.',
      'Apply a protectant fungicide such as mancozeb or metalaxyl at first sign.',
      'Improve drainage and avoid planting in low-lying, poorly drained areas.',
      'Stake plants to keep foliage above soil moisture.',
      'Monitor weather — apply preventive spray when cool, rainy periods are forecast.',
    ],
  },
  {
    id: 'powdery_mildew',
    keywords: [
      'Powdery_mildew',
      'Grape___Powdery_mildew',
      'Cucumber___Powdery_mildew',
      'Wheat___Powdery_mildew',
    ],
    title: 'Powdery Mildew',
    description:
      'A fungal disease coating leaves in white, dusty spores. It favours warm days, cool nights, and shaded conditions, reducing photosynthesis and yield.',
    steps: [
      'Prune plants to open canopy and improve air circulation.',
      'Apply sulfur-based or neem oil fungicides at first sign of white coating.',
      'Mix 1 tablespoon baking soda + 1 teaspoon liquid soap in 1 gallon water as a DIY spray.',
      'Remove heavily infected leaves and dispose of them (do not compost).',
      'Apply wettable sulfur or potassium bicarbonate every 5–7 days until conditions dry out.',
    ],
  },
  {
    id: 'bacterial_spot',
    keywords: ['Bacterial_spot', 'Tomato___Bacterial_spot', 'Pepper___Bacterial_spot'],
    title: 'Bacterial Spot',
    description:
      'Xanthomonas vesicatoria causes small, dark, water-soaked spots on leaves and fruit, leading to leaf drop and scarred, unmarketable produce.',
    steps: [
      'Remove and destroy symptomatic plants or plant parts.',
      'Spray with copper bactericide (copper hydroxide) every 5–7 days.',
      'Avoid working in the garden when foliage is wet to prevent spread.',
      'Use disease-free seeds and transplants from certified sources.',
      'Practice crop rotation for at least 2 years with non-solanaceous crops.',
    ],
  },
  {
    id: 'leaf_mold',
    keywords: ['Tomato___Leaf_Mold', 'Leaf_Mold', 'Passalora'],
    title: 'Tomato Leaf Mold',
    description:
      'Caused by the fungus Passalora fulva, leaf mold appears as pale green or yellowish spots on upper leaf surfaces with olive-green to brown velvet on the undersides.',
    steps: [
      'Improve ventilation by thinning inner foliage and widening plant spacing.',
      'Reduce relative humidity in greenhouses to below 85%.',
      'Apply a contact fungicide such as chlorothalonil or mancozeb.',
      'Remove and burn severely infected lower leaves.',
      'Use resistant varieties when available and avoid excessive nitrogen fertilization.',
    ],
  },
  {
    id: 'apple_scab',
    keywords: ['Apple___Apple_scab', 'Apple_scab', 'Venturia'],
    title: 'Apple Scab',
    description:
      'Venturia inaequalis causes velvety brown to olive spots on leaves and dark, scabby lesions on fruit, drastically reducing yield and quality.',
    steps: [
      'Apply preventive fungicides (captan or myclobutanil) starting at green tip stage.',
      'Rake and destroy fallen leaves in autumn to reduce overwintering inoculum.',
      'Prune trees to open the canopy and promote rapid drying of foliage.',
      'Remove infected fruit as soon as it appears.',
      'Plant scab-resistant cultivars such as Liberty, Enterprise, or Prima.',
    ],
  },
  {
    id: 'grape_esca',
    keywords: ['Grape___Esca', 'Esca', 'Grape_trunk'],
    title: 'Grape Esca (Trunk Disease)',
    description:
      'A complex fungal disease causing tiger-stripe leaf patterns, berry shrivelling, and progressive wood necrosis that can kill vines over several years.',
    steps: [
      'Prune in dry weather and apply wound protectant (e.g., acrylic paint or fungicide paste).',
      'Remove and destroy dead or severely infected arms and cordons.',
      'Avoid heavy summer pruning which creates large wounds.',
      'Implement proper canopy management to reduce prolonged leaf wetness.',
      'Consider grafting onto less susceptible rootstocks in replant situations.',
    ],
  },
  {
    id: 'downy_mildew',
    keywords: ['Cucumber___Downy_mildew', 'Downy_mildew', 'Plasmopara'],
    title: 'Downy Mildew',
    description:
      'Caused by Pseudoperonospora cubensis, this pathogen produces angular yellow spots on leaves with grey-purple spores underneath, leading to rapid defoliation.',
    steps: [
      'Apply protectant fungicides such as mancozeb or copper before infection occurs.',
      'Use systemic fungicides (e.g., metalaxyl or mandipropamid) once symptoms appear.',
      'Remove and destroy infected plant debris after harvest.',
      "Plant resistant cucumber varieties such as 'Marketmore' or 'Corona'.",
      'Avoid overhead irrigation and maintain wide plant spacing for airflow.',
    ],
  },
];

/**
 * Find the best treatment match for a given disease label.
 * Falls back to a generic recommendation if no match is found.
 * @param {string} label
 * @returns {{ title: string, description: string, steps: string[] }}
 */
export function getTreatment(label) {
  if (!label) {
    return {
      title: 'Consult an Agronomist',
      description:
        'No disease label was provided. Please consult a local agronomist or extension service for an accurate diagnosis and treatment plan.',
      steps: [],
    };
  }

  // Case-insensitive substring match across all keywords
  const normalised = label.toLowerCase();
  const match = TREATMENTS.find((t) =>
    t.keywords.some((kw) => normalised.includes(kw.toLowerCase()))
  );

  if (match) {
    return {
      title: match.title,
      description: match.description,
      steps: match.steps,
    };
  }

  return {
    title: 'Consult an Agronomist',
    description:
      'The detected disease is not in our treatment database. Please consult a local agronomist or agricultural extension service for an accurate diagnosis and tailored management plan.',
    steps: [
      'Take a clear, well-lit photograph of the affected plant.',
      'Note which parts of the plant are affected and when symptoms first appeared.',
      'Contact your nearest agricultural extension office or licensed agronomist.',
      'Do not apply chemical treatments without professional guidance.',
      'Keep the affected plant away from healthy crops to prevent potential spread.',
    ],
  };
}

export { TREATMENTS };