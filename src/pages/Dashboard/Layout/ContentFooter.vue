<template>
  <footer class="footer">
    <div class="container">
      <nav>
        <ul>
          <!-- <li>
            <a v-if="$route.meta.rtlActive" href="https://www.creative-tim.com" target="_blank">
              منزل
            </a>
            <a v-else href="https://www.creative-tim.com" target="_blank">
              Creative Tim
            </a>
          </li> -->
          <li>
            <a v-if="$route.meta.rtlActive" href="https://www.develution.it/privacy" target="_blank">
              سياسة الخصوصية
            </a>
            <a href="https://www.develution.it/privacy" target="_blank">
              PRIVACY POLICY
            </a>
          </li>
          <li>
            <a v-if="$route.meta.rtlActive" href="http://blog.creative-tim.com" target="_blank">
             معلومات عنا
            </a>
            <a v-else href="https://creative-tim.com/presentation">
              About Us
            </a>
          </li>
          <!-- <li>
            <a v-if="$route.meta.rtlActive" href="http://blog.creative-tim.com" target="_blank">
              محفظة
            </a>
            <a v-else href="http://blog.creative-tim.com" target="_blank">
              Blog
            </a>
          </li> -->
          <!-- <li>
            <a v-if="$route.meta.rtlActive" href="https://www.creative-tim.com/license" target="_blank">
              بلوق
            </a>
            <a v-else href="https://www.creative-tim.com/license" target="_blank">
              Licenses
            </a>
          </li> -->
        </ul>
      </nav>
      <div class="copyright text-center">
        <!-- &copy; {{ new Date().getFullYear() }}, -->
        Designed and Coded
        by
        DEVELUTION
        <!-- <a href="https://www.creative-tim.com/?ref=mdp-vuejs-api" target="_blank">Creative Tim</a>
        and
        <a href="https://www.updivision.com/?ref=mdp-vuejs-api" target="_blank">UPDIVISION</a>
        for a better web. -->
      </div>
    </div>
  </footer>
</template>
<script>
export default {};
</script>
<style></style>
