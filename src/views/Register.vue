<template>
  <div class="Register">
    <h1>This is the Register form</h1>
    <div class="signin">
      <div class="content">
        <h2>Sign In</h2>

        <div class="form bg-white rounded px-8 pt-6 pb-8 mb-4">
          <div class="mb-4">
            <div
              class="block text-gray-700 text-sm font-bold mb-2"
              for="username"
            >
              Username
            </div>

            <input
              type="text"
              v-model="username"
              required
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div>
            <div
              class="block text-gray-700 text-sm font-bold mb-2"
              for="password"
            >
              Password
            </div>
          </div>

          <input
            type="password"
            v-model="password"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          <div>
            <div class="block text-gray-700 text-sm font-bold mb-2" for="email">
              Email
            </div>
          </div>

          <input
            type="email"
            v-model="email"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          <div class="inputBox">
            <label for="role">Role</label>
            <select name="role" id="role" v-model="role">
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

            <div class="links">
      <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
              Forgot Password</a>
        
            </div>

            <div class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            <input type="submit" value="Register" @click.prevent="Register" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"; // Make sure to import axios

export default {
  data() {
    return {
      username: "testing",
      password: "testing",
      email: "testign@gmail.com",
      role: "user",
    };
  },

  methods: {
    async Register() {
      // Corrected the method definition
      try {
        const dataToSend = JSON.stringify({
          body: JSON.stringify({
            username: this.username,
            password: this.password,
            email: this.email,
            role: this.role,
          }),
        });

        const response = await axios.post(
          "https://gba3z9htkc.execute-api.us-east-1.amazonaws.com/dev",
          dataToSend,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(response.data);
      } catch (error) {
        console.error("Registration failed", error);
      }
    },
  },
};
</script>
