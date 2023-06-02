<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <!-- <ion-title size="large">Blank</ion-title> -->
          <button></button>
        </ion-toolbar>
      </ion-header>

      <div id="main" class="container">
        <div class="logo"></div>
        <span>Welcome to Customer's</span>
        <h2>Diamond Detailers Portal</h2>
        <br />
        <ion-button color="warning" href="/authentication">Login</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButton,
} from "@ionic/vue";

export default {
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButton,
  },

  mounted() {
    if (localStorage.getItem("email")) {
      window.location.href = "/customer"
    }
  },

  computed: {
    checkUserType() {
      const type = localStorage.getItem("type")

      return type
    },
  },

  methods: {}
};
</script>

<style lang="scss">
// <-- Global css theme --> 
@font-face {
  font-family: 'Gotham-Black';
  src: url('@/assets/fonts/Gotham-Black.otf');
}

@font-face {
  font-family: 'Gotham-Book';
  src: url('@/assets/fonts/Gotham-Book.otf');
}

@font-face {
  font-family: 'Gotham-Light';
  src: url('@/assets/fonts/Gotham-Light-Regular.otf');
}

div {
  font: 1.2rem 'Gotham-Book';
}

.container {
  text-align: center;
  width: 100%;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 10rem;
  height: 100%;
  
  &.employer {
    margin-top: 5rem;
    height: 80%;
  }
}

ion-content {
  --background: none;
  background: no-repeat center url('@/assets/img/background2.png');
  background-size: auto 100%;
  background-color: #000;
}

ion-button {
  font: 1.1rem "Gotham-Book";
}

.logo {
  margin: 0 auto;
  background: no-repeat url('@/assets/img/diamonddetailers.png');
  background-size: 100%;
  width: 45vw;
  height: 45vw;
  margin-bottom: 0.5rem;

  &.small {
    width: 28vw;
    height: 28vw;
    margin-bottom: 1rem;
  }
}

form {
  overflow-y: auto;
  height: 75%;
  width: 100%;
  margin: auto;
  background-color: rgba(255, 213, 52, 0.9);
  padding: 1.5rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: rgba(255, 213, 52, 0.4) 0px 5px,
    rgba(255, 213, 52, 0.3) 0px 10px, rgba(255, 213, 52, 0.2) 0px 15px,
    rgba(255, 213, 52, 0.1) 0px 20px, rgba(255, 213, 52, 0.05) 0px 25px;

  .input-group {
    ion-input, ion-select {
      --highlight-color-focused: #000;
      --background: rgba(255, 255, 255, 0.5);
      --color: #000 ;
      color: #000;
      margin-bottom: 0.5rem;

      &.input-disabled {
        opacity: 0.8;
        --background: rgba(255, 255, 255, 0.1);
      }
    }

    /* margin-bottom: 2rem; */

  }
  
  &.dark {
    background-color: rgba(255, 255, 255, 0.8);
    padding: 1.5rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: rgba(255, 255, 255, 0.4) 0px 5px,
      rgba(255, 255, 255, 0.3) 0px 10px, rgba(255, 255, 255, 0.2) 0px 15px,
      rgba(255, 255, 255, 0.1) 0px 20px, rgba(255, 255, 255, 0.05) 0px 25px;
    
    p {
      color: #000;
    }
    
    .input-group {
      ion-input, ion-select, ion-textarea {
        --highlight-color-focused: #000;
        --background: rgba(255, 255, 255, 1);
        --color: #000;
        color: #000;

        &.input-disabled {
          opacity: 0.8;
          --background: rgba(255, 255, 255, 0.1);
        }
      }

      ion-textarea {
        margin-bottom: 0.5rem;
        text-align: left;
      }
    }
  }
}

.form-btn {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  ion-button {
    border: 1px solid #000;
    font-size: 0.9rem;
  }
}

.error {
  margin-top: 1.5rem;
  color: red;
}

@media (max-width: 500px) {
  .logo {
    &.small {
      width: 10rem;
      height: 10rem;
    }
  }
}

// <-- Global css theme end --> 

#main {
  margin-top: 0;

  h2 {
    font: 1.7rem 'Gotham-Black';
    margin-top: 0.3rem;
    margin-bottom: 5rem;
  }

  h4 {
    margin-bottom: 1.5rem;
  }
}
</style>
