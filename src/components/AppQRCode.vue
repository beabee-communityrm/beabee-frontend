<!--
  # AppQRCode
  A component that displays a QR code.

  ## Props
  - `qrData` (string): The data to encode in the QR code.
  - `typeNumber` (number): The type number (1 ~ 40), or 0 for auto detection. Defaults to 0.
  - `correctionLevel` (string): The error correction level. Defaults to 'H'.
-->

<template>
  <div ref="qrContainerEl" class="w-full aspect-square"></div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import qrCode from 'qrcode-generator';

// Types not exported by qrcode-generator

/** Type number (1 ~ 40), or 0 for auto detection. */
type TypeNumber =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40;

type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

interface AppQRCodeProps {
  qrData: string;
  typeNumber?: TypeNumber;
  correctionLevel?: ErrorCorrectionLevel;
}

const qrContainerEl = ref<HTMLDivElement | null>(null);

const props = withDefaults(defineProps<AppQRCodeProps>(), {
  typeNumber: 0,
  correctionLevel: 'H',
});

const onQrDataChanged = (newValue: AppQRCodeProps) => {
  if (!qrContainerEl.value) {
    throw new Error('qrContainerEl is null!');
  }

  const qr = qrCode(newValue.typeNumber || 0, newValue.correctionLevel || 'H');
  qr.addData(newValue.qrData);
  qr.make();

  qrContainerEl.value.innerHTML = qr.createSvgTag(4);
  const svgEl = qrContainerEl.value.children[0] as SVGElement;
  svgEl.setAttribute('width', '100%');
  svgEl.setAttribute('height', '100%');
};

onMounted(() => {
  watch(props, onQrDataChanged, { deep: true });
  onQrDataChanged(props);
});
</script>
