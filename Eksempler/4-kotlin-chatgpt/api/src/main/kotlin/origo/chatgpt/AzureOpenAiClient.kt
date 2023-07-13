package origo.chatgpt

import com.azure.ai.openai.OpenAIClientBuilder
import com.azure.ai.openai.models.ChatCompletions
import com.azure.ai.openai.models.ChatCompletionsOptions
import com.azure.ai.openai.models.ChatMessage
import com.azure.core.credential.AzureKeyCredential

class AzureOpenAiClient {
    private val deploymentName = System.getenv("DEPLOYMENT_NAME")
        ?: throw NullPointerException("Environment variable 'DEPLOYMENT_NAME' is NULL. Set this environment variable and run again." )

    private val apiKey = System.getenv("API_KEY")
        ?: throw NullPointerException("Environment variable 'API_KEY' is NULL. Set this environment variable and run again." )

    private val endpoint = "https://openai-test-for-hackathon-research-us.openai.azure.com/"

    private val azureClient by lazy {
        OpenAIClientBuilder()
            .credential(AzureKeyCredential(apiKey))
            .endpoint(endpoint)
            .buildClient()
    }

    fun fetchNextChatMessage(chatHistory: List<ChatMessage>): String {
        val chatCompletions: ChatCompletions = azureClient.getChatCompletions(
            deploymentName,
            ChatCompletionsOptions(chatHistory)
        )

        val responseAlternatives = chatCompletions.choices.map {
            it.message.content
        }

        return responseAlternatives.first()
    }
}
