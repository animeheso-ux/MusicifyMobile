
import { Text, View, StyleSheet, TextInput, Pressable, FlatList, Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { ImageBackground } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio"

export default function MusicPage() {
    const [songList, setSongs] = useState([])
    const [CurrentSongName, setCurrentSongName] = useState("")
    const audio = useAudioPlayer()
    const status = useAudioPlayerStatus(audio)
    const [link, setlink] = useState("")
    const [uploadstate, changeuploadstate] = useState("submit")
    const [currentSongIndex, setCurrentSongIndex] = useState(0)







    async function GetToken() {
        const Token = await AsyncStorage.getItem("Token")

        if (!Token) {
            console.log("token not found!")
            return
        }

        const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/GetToken`, {
            headers: {
                "authorization": `Bearer ${Token}`,
                "Content-Type": "application/json"
            }
        })

        const data = await response.json()


        if (data.status !== "success") {
            router.replace("login")
        }

        return data.Token
    }

    async function uploadSongs() {
        changeuploadstate("downloading songs...")
        if (link == "") {
            changeuploadstate("submit")
            return Alert.alert("empty field")
        }



        const Token = await GetToken()

        const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/uploadSong`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ Link: link, user_id: Token["id"] })
        })


        setlink("")


        const data = await response.json()


        if (data.message == "success") {
            changeuploadstate("success")
            GetSongs()
        }



    }

    async function shuffle() {
        const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/Shuffle`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ musiclist: songList })
        })

        const data = await response.json()

        setSongs(data.result)
    }

    async function startPlaylist() {
        setCurrentSongName(songList[0]["title"])
        audio.replace(`${process.env.EXPO_PUBLIC_IP}/MusicFolder/${songList[0]["filename"]}`)

        audio.play()
    }


    async function GetSongs() {
        const Token = await GetToken()
        const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/GetSongs/${Token["id"]}`)

        const data = await response.json()

        setSongs(data.songList)
    }


    async function playSongs(song) {
        setCurrentSongName(song.title)
        setCurrentSongIndex(songList.findIndex(s => s["id"] == song.id))
        audio.replace(`${process.env.EXPO_PUBLIC_IP}/MusicFolder/${song.filename}`)

        audio.play()


    }

    async function playNextSong(index) {
        setCurrentSongName(songList[index]["title"])
        audio.replace(`${process.env.EXPO_PUBLIC_IP}/MusicFolder/${songList[index]["filename"]}`)

        audio.play()
    }

    async function deleteSongs(song) {
        const Token = await GetToken()
        const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/deleteSong/${Token["id"]}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ music_id: song["id"] })
        })

        const data = await response.json()


        if (data.status == "success") {
            GetSongs()
        }
    }

    async function pauseSong() {
        if (audio.playing) {
            audio.pause()
        }
    }

    useEffect(() => {
        if (CurrentSongName !== "") {

            if (status.didJustFinish) {
                let index = currentSongIndex
                console.log("FINISH")
                if (currentSongIndex < songList.length) {
                    index += 1
                    setCurrentSongIndex(index)

                } else {
                    index = 0
                    setCurrentSongIndex(0)
                }


                playNextSong(index)

            }
        }
    }, [status.didJustFinish])


    useEffect(() => {
        GetSongs()
    }, [])

    return (
        <View style={styles.container}>
            <ImageBackground source={require("../assets/sakurabackground2.jpg")} style={styles.background}>

            <View style={styles.topNav}>
                <Text style={{color : "#FFF" , fontSize : 32}}>Playlist</Text>
            </View>

                <View style={styles.playContainer}>

                    <LinearGradient colors={["rgba(128,0,128,0.5)", "rgba(255, 192, 203,0.8)"]}
                        start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 1 }} style={{ zIndex: 0 }} >


                        <Pressable style={styles.PlayButton} onPress={startPlaylist}>
                            <Text>start playlist</Text>
                        </Pressable>

                        <Pressable style={styles.PlayButton} onPress={shuffle} >
                            <Text>shuffle</Text>
                        </Pressable>

                    </LinearGradient>
                </View>

                <View style={styles.UploadContainer}>
                    <TextInput style={styles.Textbox} placeholder="Enter youtube url here" onChangeText={setlink} value={link}></TextInput>

                    <LinearGradient colors={["rgba(128,0,128,0.5)", "rgba(255, 192, 203,0.8)"]}
                        start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 1 }} style={{ zIndex: 0 }}>

                        <Pressable onPress={uploadSongs} >
                            <Text>{uploadstate}</Text>
                        </Pressable>



                    </LinearGradient>
                </View>

                <FlatList
                    data={songList}
                    keyExtractor={(song) => String(song.id)}
                    renderItem={({ item: song }) => (
                        <View
                            style={[
                                styles.Song,
                                CurrentSongName === song.title && styles.SongActive
                            ]}
                        >
                            <Text style={styles.songTitle}>
                                {song.title}
                            </Text>

                            <View style={styles.OptionsDiv}>
                                <Pressable
                                    style={styles.PlayButton}
                                    onPress={() => playSongs(song)}
                                >
                                    <Text>▶</Text>
                                </Pressable>

                                <Pressable
                                    style={styles.PauseButton}
                                    onPress={pauseSong}
                                >
                                    <Text>⏸</Text>
                                </Pressable>

                                <Pressable
                                    style={styles.DeleteButton}
                                    onPress={() => deleteSongs(song)}
                                >
                                    <Text>Delete</Text>
                                </Pressable>
                            </View>
                        </View>
                    )}
                />


            </ImageBackground>



        </View>
    )
}






const styles = StyleSheet.create({
    topNav : {
        top : 0,
        borderBlockColor : "#e086f7",
        backgroundColor : "#e086f7",
        width : "100%",
        height : "10%",
        borderRadius : 5,
        alignItems : "center",
        justifyContent : "flex-end"
    },
    SubmitButton: {
        borderRadius: 20,
        color: "#fff",
        width: 100,
        alignItems: "center"
    },
    container: {
        flex: 1
    },
    background: {
        flex: 1,
        zIndex: 0
    },

    Song: {
        flexDirection: "row",
        alignItems: "center",
        top : 0,

        width: "95%",
        bottom: "-80%",
        height: 60,

        marginBottom: 10,
        paddingHorizontal: 12,

        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.5)",
        borderRadius: 15,

        backgroundColor: "rgba(128,0,128,0.5)",
    },

    SongActive: {
        backgroundColor: "rgba(61,39,61,0.5)",
        borderColor: "rgba(255,255,255,0.5)",
    },

    songTitle: {
        flex: 1,
        color: "white",
        fontSize: 16,
    },

    OptionsDiv: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },

    PlayButton: {
        width: 60,
        height: 40,

        justifyContent: "center",
        alignItems: "center",
    },

    PauseButton: {
        width: 40,
        height: 40,

        justifyContent: "center",
        alignItems: "center",
    },

    DeleteButton: {
        paddingHorizontal: 8,
        paddingVertical: 6,

        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.5)",
        borderRadius: 10,

        backgroundColor: "rgba(128,0,128,0.5)",
    },
    UploadContainer: {
        position: "absolute",
        bottom: 50,
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 1
    },
    playContainer: {
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 1,
        gap: 16,
    },

    Textbox: {
        backgroundColor: "rgb(139, 24, 156)",
        width: 250
    }
});