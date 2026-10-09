import { Pressable, Text, TextInput, View, StyleSheet, Alert, Image } from "react-native"
import { useEffect, useState } from "react"
import { router } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { LinearGradient } from "expo-linear-gradient"



export default function LoginPage() {
    const [page, setpage] = useState("login")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [confrimPassword, setConfrimPassword] = useState("")


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


        if (data.status == "success") {
            router.replace("home")
        }

        return data.Token
    }


    async function Login() {
        if (username.length == 0 || password.length == 0) {
            return Alert.alert("fields cannot be blank")
        }

        const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: username, password: password })
        })

        const data = await response.json()


        alert(data.message)
        if (data.message == "success") {
            await AsyncStorage.setItem("Token", data.Token)
            router.replace("home")
        }
    }

    async function CreateAccount() {
        if (username.length == 0 || password.length == 0 || email.length == 0) {
            return Alert.alert("fields cannot be blank")
        }

        if (password !== confrimPassword) {
            return Alert.alert("Password fields are not matching.")
        }

        const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/CreateAccount`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: username, password: password, email: email })
        })

        const data = await response.json()


        alert(data.message)
        if (data.message == "success") {
            setpage("login")
        }
    }


    useEffect(() => {
        GetToken()
    }, [])

    return (
        <View style={styles.container}>

            {page === "login" ? (
                <View style={styles.loginContainer}>
                    <Image style={styles.Logo} source={require("../assets/Icon.png")} />
                    <Text style={styles.MainText}>Login</Text>


                    <Text style={{ width: 285 }}>Username/Email:</Text>
                    <LinearGradient colors={["rgba(128,0,128,0.5)", "rgba(255, 192, 203,0.8)"]}
                        start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 1 }} style={{ zIndex: 0, borderRadius: 20 }}>
                        <TextInput style={styles.InputField} placeholderTextColor={"#FFF"} placeholder="username/email:" onChangeText={(inputText) => setUsername(inputText)}></TextInput>
                    </LinearGradient>

                    <Text style={{ width: 285 }} >Password:</Text>
                    <LinearGradient colors={["rgba(128,0,128,0.5)", "rgba(255, 192, 203,0.8)"]}
                        start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 1 }} style={{ zIndex: 0, borderRadius: 20 }}>


                        <TextInput style={styles.InputField} placeholderTextColor={"#FFF"} placeholder="password:" onChangeText={(inputText) => setPassword(inputText)}></TextInput>
                    </LinearGradient>


                    <Pressable onPress={Login} style={styles.button} >
                        <Text style={styles.buttonText} >Login</Text>
                    </Pressable>


                    <Pressable onPress={() => { setpage("sign") }} style={styles.button} >
                        <Text style={styles.buttonText} >Create an account</Text>
                    </Pressable>


                </View>
            ) : (
                <View style={styles.loginContainer}>

                    <Text>Create Account</Text>
                    <Text>Username:</Text>

                    <LinearGradient colors={["rgba(128,0,128,0.5)", "rgba(255, 192, 203,0.8)"]}
                        start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 1 }} style={{ zIndex: 0, borderRadius: 20 }}>

                        <TextInput style={styles.InputField} placeholder="username:" onChangeText={(inputText) => setUsername(inputText)} ></TextInput>
                    </LinearGradient>

                    <Text>Email:</Text>

                    <LinearGradient colors={["rgba(128,0,128,0.5)", "rgba(255, 192, 203,0.8)"]}
                        start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 1 }} style={{ zIndex: 0, borderRadius: 20 }}>
                        <TextInput style={styles.InputField} placeholder="Email:" onChangeText={(inputText) => setEmail(inputText)} ></TextInput>
                    </LinearGradient>

                    <Text>Password:</Text>

                    <LinearGradient colors={["rgba(128,0,128,0.5)", "rgba(255, 192, 203,0.8)"]}
                        start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 1 }} style={{ zIndex: 0, borderRadius: 20 }}>
                        <TextInput style={styles.InputField} placeholder="password:" onChangeText={(inputText) => setPassword(inputText)}></TextInput>
                    </LinearGradient>


                    <Text>Confrim password:</Text>


                    <LinearGradient colors={["rgba(128,0,128,0.5)", "rgba(255, 192, 203,0.8)"]}
                        start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 1 }} style={{ zIndex: 0, borderRadius: 20 }}>
                        <TextInput style={styles.InputField} placeholder="password:" onChangeText={(inputText) => setConfrimPassword(inputText)}></TextInput>
                    </LinearGradient>





                    <Pressable onPress={CreateAccount} style={styles.button}>
                        <Text style={styles.buttonText}>Create Account</Text>
                    </Pressable>


                    <Pressable onPress={() => { setpage("login") }} style={styles.button}>
                        <Text style={styles.buttonText} >Back to login</Text>
                    </Pressable>


                </View>
            )}



        </View>
    )
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#e19ef4"
    },
    loginContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        width: 300
    },
    MainText: {
        fontSize: 35,
        color: "#FFF"
    },
    InputField: {
        width: 300,
    },
    Logo: {
        width: 300,
        height: 150,
        resizeMode: "contain"
    },
    navigationLink: {

    },
    button: {
        width: 300,
        backgroundColor: "#854ac8",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        height: 50,
    },

    buttonText: {
        fontSize: 20,
        color: "#fff"
    }
})