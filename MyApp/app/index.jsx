import { Text, View, StyleSheet, Image, ImageBackground, ActivityIndicator } from "react-native"
import { router } from "expo-router"

//Loading Page

export default function DefaultPage() { 

    setTimeout(() => {
        router.replace("login")
    }, 2000);


    return (
        <View style={styles.container}>
            <ImageBackground source={require("../assets/sakurabackground2.jpg")} style={styles.background}>
                <View style={styles.filter}>
                    <Image style={styles.Logo} source={require("../assets/Icon.png")} />


                    <ActivityIndicator size="large" />
                    <Text style={styles.loading}>Loading your music...</Text>
                </View>
            </ImageBackground>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    Logo: {
        width: 300,
        height: 150,
        resizeMode: "contain"
    },
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    filter: {
        flex: 1,
        backgroundColor: "rgba(205, 115, 202, 0.5)"
    },
    loading: {
        color: "white",
        marginTop: 15,
        fontSize: 16,
    },
})