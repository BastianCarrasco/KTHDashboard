<template>
  <Radar :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Radar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler);

// Props del componente
const props = defineProps({
  evaluations: {
    type: Array,
    required: true
  }
});

// Preparar data para radar
const chartData = {
  labels: ['CRL', 'TRL', 'TEAM', 'BRL', 'FRL', 'IPRL'],
  datasets: props.evaluations.map((item, index) => {
    const date = new Date(item.fecha).toLocaleDateString('es-CL');
    return {
      label: date,
      data: [item.crl, item.trl, item.team, item.brl, item.frl, item.iprl],
      fill: true,
      backgroundColor: `rgba(54, 162, 235, 0.2)`,
      borderColor: `rgba(54, 162, 235, 1)`,
      pointBackgroundColor: `rgba(54, 162, 235, 1)`
    };
  })
};

const chartOptions = {
  responsive: true,
  scales: {
    r: {
      min: 0,
      max: 10,
      ticks: {
        stepSize: 1
      }
    }
  },
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Evaluaciones Históricas (Radar)'
    }
  }
};
</script>
