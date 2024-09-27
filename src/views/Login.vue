<template>
  <div class="login">
    <div class="signin">
      <div class="content">
        <div class="w-full max-w-md">
          <div class="form bg-white rounded px-8 pt-6 pb-8 mb-4">
                  <h2 class="text-center text-3xl font-lilita">Sign In</h2>

            <div class="mb-4">
              <div
                class="block text-gray-700 text-sm font-bold mb-2"
                for="username"
              >
                Username
              </div>
              <input type="username" v-model="username" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              <i>username</i>
            </div>

            <div class="mb-4">
             <div
                class="block text-gray-700 text-sm font-bold mb-2"
                for="password"
              >
                Password
              </div>
              <input type="password" v-model="password" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              <i>Password</i>
            </div>

            <div class="links">
      <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
              Forgot Password</a> 
              <a href="#">Signup</a>
            </div>

            <div class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              <input type="submit" value="Login" @click="login" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";


const store = useStore();
const router = useRouter();

const username = ref("DulangiK");
const password = ref("Dulangi@1234");
const idToken = ref("");

const updateUser = (user) => {
  store.commit("updateUser", user);
};

const login = async () => {
  try {
    console.log("Vuex store:", store);
    console.log("Store dispatch method:", store.dispatch);

    const send = JSON.stringify({
          body: JSON.stringify({
            password: password.value,
            username: username.value,
          }),
        });

    const response = await axios.post(
      "https://npyhbffqbe.execute-api.us-east-1.amazonaws.com/dev",send , 
      {
       
        headers: {
          "Content-Type": "application/json",
        },
        
      }
    );
    console.log("Full Response:", response.data);
    const data = response.data;
    console.log("Full Response Data:", data);
    const parsedresponsebody = JSON.parse(data.body);

    console.log("Parsed Response Body:", parsedresponsebody);
    store.dispatch("updateUser", {
      username: username.value,
      role: parsedresponsebody.role,
      idToken: parsedresponsebody.idToken,
      accessToken: parsedresponsebody.accessToken,
    });
    console.log("Vuex store:", store);
    console.log(store.state.user.idToken);
    if (parsedresponsebody.role === "admin") {
      router.push("/admin-dashboard");
    } else {
      router.push("/user-dashboard");
    }
  } catch (error) {
    console.error("Login failed", error);
  }
};
</script>
