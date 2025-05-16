package com.eromteknas.expensa

import android.content.Context
import com.facebook.flipper.android.AndroidFlipperClient
import com.facebook.flipper.android.utils.FlipperUtils
import com.facebook.flipper.core.FlipperClient
import com.facebook.flipper.plugins.databases.DatabasesFlipperPlugin
import com.facebook.flipper.plugins.databases.impl.SqliteDatabaseDriver
import com.facebook.flipper.plugins.databases.impl.SqliteDatabaseProvider
import com.facebook.react.ReactInstanceManager
import java.io.File

object ReactNativeFlipper {
    @JvmStatic
    fun initializeFlipper(context: Context, reactInstanceManager: ReactInstanceManager) {
        if (FlipperUtils.shouldEnableFlipper(context)) {
            val client: FlipperClient = AndroidFlipperClient.getInstance(context)

            val databasePlugin =
                    DatabasesFlipperPlugin(
                            SqliteDatabaseDriver(
                                    context,
                                    SqliteDatabaseProvider {
                                        val databaseFiles = mutableListOf<File>()

                                        // Add all known databases
                                        for (dbName in context.databaseList()) {
                                            context.getDatabasePath(dbName)?.let {
                                                databaseFiles.add(it)
                                            }
                                        }

                                        // Additionally, look for .db files in the app's data
                                        // directory
                                        val dataDir = context.dataDir
                                        val extraDbFiles =
                                                dataDir?.listFiles { _, name ->
                                                    name.endsWith(".db")
                                                }
                                                        ?: emptyArray()

                                        databaseFiles.addAll(extraDbFiles)

                                        databaseFiles
                                    }
                            )
                    )

            client.addPlugin(databasePlugin)
            client.start()
        }
    }
}

// https://gist.github.com/kilbot/253e4bfb0b931f9dfc23a45f71564bf7