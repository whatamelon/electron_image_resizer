<script setup lang="ts">
import { ref, computed } from 'vue'
import { Loading } from 'quasar'

const ratioPercentage = ref(90)
const minSize = ref(500)
const images = ref<Array<string>>([])
const copyDirectoryPath = ref('')

const calcPercentage = computed(() => {
  return 100 - ((100 * ratioPercentage.value) / 100)
})

const getImages = async () => {
  images.value = await window.api.getImages()
  console.log(images.value)
}

const learnHowtoSelectMultipleFiles = async () => {
  window.open('https://jsix.tistory.com/1084')
}

const resizeImages = async () => {
  if (ratioPercentage.value === 0 && minSize.value === 0) {
    alert('비율 및 최소값을 설정해주세요.')
  } else {
    if (images.value.length > 0) {
      Loading.show({
        message: '이미지 리사이징 중입니다.',
        backgroundColor: 'black'
      })
      const b = images.value[0].lastIndexOf('\\')

      copyDirectoryPath.value = images.value[0].slice(0, b) + '\\resize\\'
      for (const i in images.value) {
        console.log(copyDirectoryPath.value + images.value[i].split('\\').pop())
        const originPath = images.value[i]
        const savePath = copyDirectoryPath.value
        const imgName = images.value[i].split('\\').pop()
        const percentage = ratioPercentage.value
        const minimum = minSize.value
        const r = await window.api.resizeImage(
          originPath,
          savePath,
          imgName || '',
          percentage,
          minimum
        )
        console.log('r,,,' + r)
        if (parseInt(i) + 1 === images.value.length) {
          Loading.hide()
          alert('이미지 리사이징을 완료했습니다!')
          const x = await window.api.openDirectory(savePath)
        }
      }
    } else {
      alert('리사이징할 사진을 선택해주세요.')
    }
  }
}

</script>

<template>
  <q-page class="q-mb-xl">
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card>
        <q-card-section class="bg-secondary text-white">
          <div class="row">
            <q-icon name="image" :size="'sm'" />
            <p class="text-subtitle1 text-weight-bold q-ml-md">사진 선택</p>
          </div>
          <span class="text-body">크기를 변경할 사진들을 선택해주세요.</span>
          <p class="text-body">파일 여러개 선택하는 방법! > <span class="text-weight-bold" style="cursor:pointer;" @click="learnHowtoSelectMultipleFiles">클릭!</span></p>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
            <q-btn flat :label="images.length > 0 ? '사진 다시 선택하기' : '사진 선택하기'" @click="getImages"></q-btn>
        </q-card-actions>
      </q-card>
      <q-card>
        <q-card-section class="bg-secondary text-white">
          <div class="row">
            <q-icon name="percent" :size="'sm'" />
            <p class="text-subtitle1 text-weight-bold q-ml-md">비율</p>
          </div>
          <span class="text-body">변경될 비율을 선택해주세요.</span>
          <p class="text-body">ex) 100px > {{ calcPercentage }}px</p>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <div class="q-gutter-sm">
            <q-radio v-model="ratioPercentage" val="50" label="50%" color="accent" keep-color />
            <q-radio v-model="ratioPercentage" val="66" label="66%" color="accent" keep-color />
            <q-radio v-model="ratioPercentage" val="75" label="75%" color="accent" keep-color />
            <q-radio v-model="ratioPercentage" val="90" label="90%" color="accent" keep-color />
          </div>
        </q-card-actions>
      </q-card>
      <q-card>
        <q-card-section class="bg-secondary text-white">
          <div class="row">
            <q-icon name="compress" :size="'sm'" />
            <p class="text-subtitle1 text-weight-bold q-ml-md">최소 크기</p>
          </div>
          <span class="text-body">변경될 사진의 최소 크기를 설정해주세요.</span>
          <p class="text-body">변경될 사진의 크기가 선택한 값보다 작다면 선택한 값의 크기로 변경됩니다.</p>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <div class="q-gutter-sm">
            <q-radio v-model="minSize" val="300" label="300px" color="accent" keep-color />
            <q-radio v-model="minSize" val="500" label="500px" color="accent" keep-color />
            <q-radio v-model="minSize" val="1000" label="1000px" color="accent" keep-color />
          </div>
        </q-card-actions>
      </q-card>
    </div>

    <q-card v-if="images.length > 0" class="q-mx-md">
      <q-card-section>
        <div class="row q-mb-sm">
          <span class="text-subtitle1 text-weight-bold">사진 리스트</span>
          <span class="text-subtitle2 text-weight-medium q-my-auto q-ml-md">{{ images.length.toString() }}장</span>
        </div>
        <div class="q-gutter-y-lg" style="grid-template-columns: repeat(6, minmax(0, 1fr)); display:grid; column-gap: 20px;">
          <q-img
          v-for="img in images"
          :key="img"
          :src="'file://'+img"
          class="shadow-4"
          style="object-fit:contain; border-radius:10px;"
          />
        </div>
      </q-card-section>
    </q-card>
    <q-page-sticky position="bottom-right" :offset="[30, 30]">
      <q-btn @click="resizeImages" fab icon="arrow_forward" color="accent" label="시작하기" />
    </q-page-sticky>
  </q-page>
</template>
