package origo.chatgpt

import com.azure.ai.openai.models.ChatMessage
import com.azure.ai.openai.models.ChatRole
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable

fun Route.simpleChatController(azureOpenAiClient: AzureOpenAiClient) {

    @Serializable
    data class SimpleChatRequest(
        val role: String,
        val content: String,
    )

    route("simple-chat") {
        post {
            val clientChatHistory = call.receive<List<SimpleChatRequest>>()

            val parsedChatHistory = clientChatHistory.map {
                val role = ChatRole.fromString(it.role)
                ChatMessage(role).setContent(it.content)
            }

            val response = azureOpenAiClient.fetchNextChatMessage(parsedChatHistory)

            call.respond(response)
        }
    }
}
