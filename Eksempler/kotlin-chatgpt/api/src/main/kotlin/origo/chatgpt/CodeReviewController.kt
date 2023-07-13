package origo.chatgpt

import com.azure.ai.openai.models.ChatMessage
import com.azure.ai.openai.models.ChatRole
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable

fun Route.codeReviewController(azureOpenAiClient: AzureOpenAiClient) {

    fun getCodeReviewPrompt(programmingLanguage: String): String {
        return """
            Act as my code reviewer and review the following code in the language $programmingLanguage.
            The most important focus of your review is ensuring that the code is easy to understand, maintainable and follows best practices for $programmingLanguage.
            Also focus on finding potential bugs, security vulnerabilities and optimization opportunities.
            You response should be written in Markdown.
            The first part of your reply should your improved version of the code enclosed in triple backticks.
            The second part of your reply should be your reasoning and the rest of your review.
        """.trimIndent()
    }

    @Serializable
    data class CodeReviewRequest(
        val language: String,
        val code: String,
    )

    route("code-review") {
        post {
            val request = call.receive<CodeReviewRequest>()

            val chatMessages: List<ChatMessage> = listOf(
                ChatMessage(ChatRole.SYSTEM).setContent(getCodeReviewPrompt(request.language)),
                ChatMessage(ChatRole.USER).setContent(request.code)
            )

            val response = azureOpenAiClient.fetchNextChatMessage(chatMessages)

            call.respond(response)
        }
    }
}
