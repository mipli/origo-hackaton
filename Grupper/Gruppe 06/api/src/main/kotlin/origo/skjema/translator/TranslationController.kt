package origo.skjema.translator

import com.azure.ai.openai.models.ChatMessage
import com.azure.ai.openai.models.ChatRole
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable

fun Route.translationController(azureOpenAiClient: AzureOpenAiClient) {
    @Serializable
    data class SchemaHelpkey(
        val ingres: String? = null,
        val article: String? = null,
    )

    @Serializable
    data class SchemaReceipt(
        val title: String? = null,
        val body: String? = null,
    )

    @Serializable
    data class SchemaElement(
        val label: String? = null,
        val text: String? = null,
    )

    @Serializable
    data class SchemaJson(
        val title: String? = null,
        val errormessage: String? = null,
        val receipt: SchemaReceipt? = null,
        val helpkey: SchemaHelpkey? = null,
        val elements: List<SchemaElement>,
    )

    route("translate") {
        post {
            val schemaJson = call.receive<SchemaJson>()
            val schemaAsString = schemaJson.toString()

            val role = ChatRole.fromString("user")
            val msg =  ChatMessage(role).setContent("""
                    Oversett verdiene i JSON objektet til engelsk som en sjørøver, bare svar med JSON objektet:
                    $schemaAsString
                """)


            val response = azureOpenAiClient.fetchNextChatMessage(listOf(msg))

            call.respond(response)
        }
    }
}
