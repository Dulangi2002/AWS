<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import axios from "axios";

const store = useStore();

const users = ref([]);
const error = ref(null);
const success = ref(null);

// Edit user function to update the email
const editUser = async (user) => {
  try {
    const requestBody = JSON.stringify({
      role: user.role,
      newemail: user.newemail,
      username: user.Username,
    });

    const datatopost = {
      body: requestBody,
    };

    const send = JSON.stringify(datatopost);

    const response = await axios.put(
      "https://9t8w678kk0.execute-api.us-east-1.amazonaws.com/dev",
      send,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.statusCode === 200) {
      success.value = "User updated successfully!";
    } else {
      const data = JSON.parse(response.data.body);
      error.value = data.message || "Something went wrong!";
      console.error("Error:", error.value);
      console.error("Response:", response);
    }
  } catch (err) {
    error.value =
      err.response?.data?.message || err.message || "Something went wrong!";
    console.error("Error:", error.value);
  }
};

// Fetch users from the API
const fetchUsers = async () => {
  try {
    const idToken = store.state.user.idToken;
    const requestBody = JSON.stringify({
      role: "admin",
    });

    const datatopost = {
      body: requestBody,
    };

    const send = JSON.stringify(datatopost);

    const response = await axios.post(
      "https://nw8upcs3ql.execute-api.us-east-1.amazonaws.com/dev",
      send,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const parsedData = JSON.parse(response.data.body);
    users.value = parsedData.users || [];

    success.value = "Users fetched successfully!";
  } catch (err) {
    error.value =
      err.response?.data?.message || err.message || "Something went wrong!";
    console.error("Error:", error.value);
  }
};

// Delete user logic (placeholder)
const deleteUser = (userId) => {
  console.log("Delete user:", userId);
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">{{ success }}</div>

    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>New Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Loop through users and display them in a table -->
        <tr v-for="user in users" :key="user.Username">
          <td>{{ user.Username }}</td>
          <td>
            {{ user.Attributes.find((attr) => attr.Name === "email").Value }}
          </td>
          <!-- Input field for new email -->
          <td>
            <input
              v-model="user.newemail"
              type="email"
              placeholder="Enter new email"
            />
          </td>
          <td>
            <button @click="editUser(user)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
.error {
  color: red;
}
.success {
  color: green;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}
th {
  background-color: #f2f2f2;
}
button {
  margin-right: 5px;
}
input[type="email"] {
  padding: 6px;
  width: 100%;
  box-sizing: border-box;
}
</style>
