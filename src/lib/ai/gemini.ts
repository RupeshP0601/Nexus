import { cache } from 'react';

export interface GeminiOptions {
    jsonMode?: boolean;
    temperature?: number;
}

export class GeminiService {
    private static apiKey = process.env.GEMINI_API_KEY || '';
    private static cacheMap = new Map<string, string>();

    /**
     * Call the Gemini API or fallback to mock responses
     */
    public static async generateContent(prompt: string, options: GeminiOptions = {}): Promise<string> {
        const cacheKey = `${prompt}_${options.jsonMode ? 'json' : 'text'}`;
        if (this.cacheMap.has(cacheKey)) {
            return this.cacheMap.get(cacheKey)!;
        }

        // Clean up API Key check
        const cleanKey = this.apiKey.trim();
        const hasKey = cleanKey && cleanKey !== 'your_gemini_api_key_here' && !cleanKey.includes('placeholder');

        if (!hasKey) {
            console.log('🤖 Gemini Client: No valid API key found. Using mock response fallback.');
            // Add a small artificial delay to simulate network call
            await new Promise((resolve) => setTimeout(resolve, 800));
            const mockResult = this.generateMockResponse(prompt, options.jsonMode);
            this.cacheMap.set(cacheKey, mockResult);
            return mockResult;
        }

        const model = 'gemini-2.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;

        let retries = 3;
        let delay = 1000;

        while (retries > 0) {
            try {
                const requestBody = {
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: options.temperature ?? 0.7,
                        ...(options.jsonMode ? { responseMimeType: 'application/json' } : {}),
                    },
                };

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                if (response.status === 429) {
                    console.warn(`⚠️ Gemini API Rate Limited (429). Retrying in ${delay}ms...`);
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    retries--;
                    delay *= 2;
                    continue;
                }

                if (!response.ok) {
                    throw new Error(`Gemini API returned status ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!text) {
                    throw new Error('Invalid response structure or empty content from Gemini API');
                }

                this.cacheMap.set(cacheKey, text);
                return text;
            } catch (error) {
                console.error(`Error in GeminiService (retries left: ${retries - 1}):`, error);
                retries--;
                if (retries === 0) {
                    throw error;
                }
                await new Promise((resolve) => setTimeout(resolve, delay));
                delay *= 2;
            }
        }

        throw new Error('Failed to generate content from Gemini API after retries');
    }

    /**
     * Returns highly realistic simulated response based on the prompt's intent
     */
    private static generateMockResponse(prompt: string, jsonMode?: boolean): string {
        const lowerPrompt = prompt.toLowerCase();

        // 1. V2 Dossier Agent Prompt Match
        if (lowerPrompt.includes('dossier v2') || lowerPrompt.includes('dossier v2 generator') || lowerPrompt.includes('company overview') && lowerPrompt.includes('business challenges')) {
            const companyName = this.extractCompanyName(prompt);
            const dossier = {
                overview: `${companyName} is a leading enterprise player driving significant operations across the Middle East. With high digital maturity and substantial investments in cloud-native platforms, they are looking to standardize compliance and scale core systems.`,
                businessChallenges: [
                    "High operational latency in cross-border transaction processing.",
                    "Disjointed legacy customer onboarding data structures across departments.",
                    "Siloed regulatory compliance reporting mechanisms leading to audit delays."
                ],
                growthInitiatives: [
                    "Accelerating digital banking deployment in GCC markets.",
                    "Transitioning core enterprise workflows to open-source microservices.",
                    "Upgrading customer support loops with conversational AI agents."
                ],
                technologyLandscape: [
                    "Hybrid Cloud (AWS/Azure)",
                    "Oracle DB, Apache Kafka, Kubernetes",
                    "Legacy ESB integrations, React / Next.js on frontend"
                ],
                painPoints: [
                    `Inefficiencies in security compliance checking during cloud migration at ${companyName}.`,
                    "Bottlenecks in API gateway processing during peak transaction periods.",
                    "Manual overhead in audit trails for central bank compliance mandates."
                ],
                competitiveRisks: [
                    "Agile fintech startups capturing localized retail market share.",
                    "Potential downtime disruptions during legacy infrastructure cutover."
                ],
                solutionPositioning: `Afors can position its core Revenue Orchestration Engine to automate transaction tracking and unify customer onboarding pipelines, offering specialized consulting to streamline the cloud compliance journey.`,
                stakeholderMapping: [
                    { role: "DecisionMaker", title: "Chief Technology Officer (CTO)", strategy: "Focus on operational savings, scalability metrics, and risk reduction during legacy migration." },
                    { role: "Champion", title: "Director of Digital Platform Innovation", strategy: "Demonstrate developer velocity improvements and API modernization speed." },
                    { role: "TechnicalEvaluator", title: "Head of Infrastructure Security", strategy: "Present automated compliance trails, security certifications, and sandboxed deployment options." }
                ],
                nextBestActions: [
                    "Schedule a technical workshop on API Orchestration architecture.",
                    "Provide a localized case study of a digital banking compliance deployment.",
                    "Draft a custom proof-of-concept proposal for transaction automation."
                ]
            };
            return jsonMode ? JSON.stringify(dossier, null, 2) : dossier.overview;
        }

        // 2. Multi-Step Outreach Sequence Prompt Match
        if (lowerPrompt.includes('outreach sequence') || lowerPrompt.includes('multi-step outreach') || lowerPrompt.includes('cold email') && lowerPrompt.includes('breakup email')) {
            const companyName = this.extractCompanyName(prompt);
            const sequence = {
                coldEmail: {
                    subjectLine: `Modernizing digital infrastructure at ${companyName}`,
                    body: `Hi [Contact Name],\n\nI’ve been tracking ${companyName}'s initiatives to expand digital banking in the region. Many enterprises encounter transaction latency bottlenecks when migrating legacy systems.\n\nAt Afors, we specialize in high-throughput revenue orchestration, helping firms decrease latency by up to 40%. Would you be open to a quick 10-minute introductory call next Tuesday to discuss how we might assist?\n\nBest,\n[Your Name]`
                },
                linkedInMessage: {
                    body: `Hi [Contact Name], noticed ${companyName}'s recent push toward hybrid cloud migration in the GCC. Would love to connect and share some insights we've compiled on region-specific regulatory compliance bottlenecks.`
                },
                followUpEmail1: {
                    subjectLine: `Following up: Modernizing digital infrastructure at ${companyName}`,
                    body: `Hi [Contact Name],\n\nI wanted to follow up on my previous note. I came across your recent tech stack modernization initiative and thought this short case study detailing how Mashreq Bank automated their compliance reporting might be relevant.\n\nLet me know if this sparks any ideas.\n\nBest,\n[Your Name]`
                },
                followUpEmail2: {
                    subjectLine: `Quick question regarding compliance overhead`,
                    body: `Hi [Contact Name],\n\nShort note: we recently launched a new sandboxed evaluation tool that estimates audit compliance overhead for cloud migrations. Is this something you or your engineering lead would be interested in seeing?\n\nBest,\n[Your Name]`
                },
                breakupEmail: {
                    subjectLine: `Moving on from ${companyName}`,
                    body: `Hi [Contact Name],\n\nI haven't heard back, so I assume that optimizing transaction orchestration compliance isn't a high priority for ${companyName} right now. I will stop my outreach.\n\nIf anything changes, please feel free to reach out anytime.\n\nBest,\n[Your Name]`
                }
            };
            return jsonMode ? JSON.stringify(sequence, null, 2) : sequence.coldEmail.body;
        }

        // 3. Meeting Prep Prompt Match
        if (lowerPrompt.includes('meeting prep') || lowerPrompt.includes('discoveryquestions')) {
            const companyName = this.extractCompanyName(prompt);
            const meetingPrep = {
                meetingObjective: "Conduct discovery, establish technical challenges around cloud migration, and secure a follow-up technical workshop.",
                agenda: [
                    "Introductions & Afors Middle East Track Record",
                    "Overview of current migration architecture and challenges",
                    "Deep-dive: Transaction latency and API gateway bottlenecks",
                    "Discussion on compliance automation opportunities",
                    "Wrap-up and Next Steps"
                ],
                discoveryQuestions: [
                    "What is your current target timeline for decommissioning the legacy ESB?",
                    "How are transaction latency SLAs tracked across your regional branches?",
                    "What has been the biggest bottleneck in your central bank audit compliance reporting?"
                ],
                possibleObjections: [
                    "We have internal migration engineering squads and don't need external consultants.",
                    "We are already using global systems integrators for this phase."
                ],
                objectionResponses: [
                    "Afors operates as specialized subject-matter experts, plugging directly into internal squads to speed up specific bottlenecks rather than replacing them.",
                    "Unlike global integrators, we have localized Middle-East compliance templates ready to deploy immediately out-of-the-box."
                ],
                nextSteps: [
                    "Share sandboxed API documentation.",
                    "Coordinate calendar invites for follow-up technical workshop."
                ]
            };
            return jsonMode ? JSON.stringify(meetingPrep, null, 2) : meetingPrep.meetingObjective;
        }

        // 4. Next Best Actions Prompt Match
        if (lowerPrompt.includes('recommendations') || lowerPrompt.includes('nextbestaction') || lowerPrompt.includes('next best action')) {
            const actions = {
                recommendations: [
                    {
                        description: "Schedule executive discovery call to present V2 Dossier insights",
                        scoreImpact: 15,
                        priority: "high",
                        actionType: "outreach"
                    },
                    {
                        description: "Send ROI case study on digital banking compliance",
                        scoreImpact: 10,
                        priority: "medium",
                        actionType: "content"
                    },
                    {
                        description: "Establish contact with the newly identified Technical Evaluator",
                        scoreImpact: 12,
                        priority: "high",
                        actionType: "stakeholder"
                    }
                ]
            };
            return jsonMode ? JSON.stringify(actions, null, 2) : "Schedule executive discovery call";
        }

        // Default JSON or Text response
        if (jsonMode) {
            return JSON.stringify({ message: "Request processed successfully.", text: "Standard generated text response." });
        }
        return "Standard generated response text from Gemini.";
    }

    private static extractCompanyName(prompt: string): string {
        // Attempt to extract company name from context
        const matches = prompt.match(/(?:Company|Account|for)\s+([A-Za-z0-9\s]+?)(?:\r|\n|\.|\,|$)/i);
        if (matches && matches[1]) {
            const name = matches[1].trim();
            if (name.length > 2 && name.length < 50) return name;
        }
        return "Target Account";
    }
}
