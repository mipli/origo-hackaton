package origo.skjema.translator

import com.azure.ai.openai.OpenAIClientBuilder
import com.azure.ai.openai.models.ChatCompletions
import com.azure.ai.openai.models.ChatCompletionsOptions
import com.azure.ai.openai.models.ChatMessage
import com.azure.core.credential.AzureKeyCredential
import io.github.cdimascio.dotenv.Dotenv

class AzureOpenAiClient {
    private lateinit var dotenv: Dotenv
    private lateinit var deploymentName: String
    private lateinit var apiKey: String
    private lateinit var endpoint: String

    constructor() {
        dotenv = Dotenv.load()
        deploymentName = dotenv.get("DEPLOYMENT_NAME")
            ?: throw NullPointerException("Environment variable 'DEPLOYMENT_NAME' is NULL. Set this environment variable and run again.")

        apiKey = dotenv.get("API_KEY")
            ?: throw NullPointerException("Environment variable 'API_KEY' is NULL. Set this environment variable and run again.")

        endpoint = dotenv.get("ENDPOINT")
            ?: throw NullPointerException("Environment variable 'ENDPOINT' is NULL. Set this environment variable and run again.")
    }

    private val azureClient by lazy {
        OpenAIClientBuilder()
            .credential(AzureKeyCredential(apiKey))
            .endpoint(endpoint)
            .buildClient()
    }

    fun fetchNextChatMessage(chatHistory: List<ChatMessage>): String {
        try {
            val chatCompletions: ChatCompletions = azureClient.getChatCompletions(
                deploymentName,
                ChatCompletionsOptions(chatHistory),
            )

            val responseAlternatives = chatCompletions.choices.map {
                it.message.content
            }

            return responseAlternatives.first()
        } catch (e: Exception) {
            return ""
        }
    }
}
