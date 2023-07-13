package origo.chatgpt

import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.jetty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main() {
    embeddedServer(Jetty, port = 9000, host = "0.0.0.0", module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    configureSerialization()
    configureRoutes()
    configureCORS()
}

fun Application.configureSerialization() {
    install(ContentNegotiation) {
        json()
    }
}

fun Application.configureRoutes() {
    val azureOpenAiClient = AzureOpenAiClient()

    routing {
        simpleChatController(azureOpenAiClient)
        codeReviewController(azureOpenAiClient)

        //Health check
        get("/") {
            call.respondText("OK")
        }
    }
}

fun Application.configureCORS() {
    install(CORS) {
        allowHost("localhost:3000")
        allowHeader(HttpHeaders.ContentType)
    }
}
