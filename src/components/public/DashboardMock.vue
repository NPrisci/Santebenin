<template>
  <div class="w-full max-w-md mx-auto dashboard-container">
    <!-- Dashboard Patient -->
    <div v-if="role === 'patient'" class="dashboard-patient">
      <!-- En-tête avec avatar -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg">
            JD
          </div>
          <div>
            <h4 class="font-bold text-slate-800 text-sm">Jean Dupont</h4>
            <p class="text-xs text-slate-500">32 ans • NPI: NPI-2024-001234</p>
          </div>
        </div>
        <button class="text-xs text-green-600 hover:text-green-700 font-medium">
          Modifier
        </button>
      </div>

      <!-- Actualités -->
      <div class="bg-green-50 rounded-xl p-3 mb-4">
        <h5 class="text-xs font-semibold text-green-800 mb-2">Actualités & Annonces</h5>
        <div class="space-y-1.5">
          <div class="flex items-start gap-2 text-xs">
            <span class="text-green-600 font-medium">14/05/2024</span>
            <span class="text-slate-600">Nouveau service de...</span>
          </div>
          <div class="flex items-start gap-2 text-xs">
            <span class="text-green-600 font-medium">12/05/2024</span>
            <span class="text-slate-600">JOURNÉE PORTES...</span>
          </div>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-3 gap-2 mb-4">
        <div class="bg-blue-50 p-2 rounded-xl text-center">
          <div class="text-xl font-bold text-blue-600">
            <AnimatedCounter :target="12" :duration="2000" />
          </div>
          <div class="text-[10px] text-slate-500">Rendez-vous</div>
        </div>
        <div class="bg-green-50 p-2 rounded-xl text-center">
          <div class="text-xl font-bold text-green-600">
            <AnimatedCounter :target="8" :duration="2000" />
          </div>
          <div class="text-[10px] text-slate-500">Analyses</div>
        </div>
        <div class="bg-purple-50 p-2 rounded-xl text-center">
          <div class="text-xl font-bold text-purple-600">
            <AnimatedCounter :target="4" :duration="2000" />
          </div>
          <div class="text-[10px] text-slate-500">Traitements</div>
        </div>
      </div>

      <!-- Graphique -->
      <div class="bg-slate-50 p-3 rounded-xl">
        <div class="flex justify-between text-xs text-slate-600 mb-2">
          <span>Progression santé</span>
          <span class="font-medium text-green-600">78%</span>
        </div>
        <div class="relative h-16 flex items-end gap-1">
          <div v-for="(item, i) in patientData" :key="i" class="flex-1 flex flex-col items-center gap-1">
            <div 
              class="w-full bg-green-400 rounded-t transition-all duration-1000"
              :style="{ height: item.height + '%' }"
            ></div>
            <span class="text-[8px] text-slate-400">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard Docteur -->
    <div v-else-if="role === 'doctor'" class="dashboard-doctor">
      <!-- En-tête -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
            DR
          </div>
          <div>
            <h4 class="font-bold text-slate-800 text-sm">Dr. Aigars</h4>
            <p class="text-xs text-slate-500">Cardiologue</p>
          </div>
        </div>
        <div class="flex gap-1">
          <span class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">📊</span>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-2 mb-4">
        <div class="bg-rose-50 p-3 rounded-xl">
          <div class="text-[10px] text-rose-600">Patients aujourd'hui</div>
          <div class="text-2xl font-bold text-slate-700">
            <AnimatedCounter :target="12" :duration="2000" />
          </div>
        </div>
        <div class="bg-indigo-50 p-3 rounded-xl">
          <div class="text-[10px] text-indigo-600">Consultations</div>
          <div class="text-2xl font-bold text-slate-700">
            <AnimatedCounter :target="8" :duration="2000" />
          </div>
        </div>
      </div>

      <!-- Revenue -->
      <div class="bg-slate-50 p-3 rounded-xl mb-3">
        <div class="flex justify-between items-center mb-2">
          <span class="text-xs text-slate-600">Total Revenue</span>
          <span class="text-xs text-green-600">+12.5%</span>
        </div>
        <div class="text-2xl font-bold text-slate-800">
          $<AnimatedCounter :target="48295" :duration="2500" prefix="$" />
        </div>
        <div class="h-12 flex items-end gap-1 mt-2">
          <div v-for="(item, i) in doctorRevenueData" :key="i" 
               class="flex-1 bg-blue-400 rounded-t transition-all duration-1000"
               :style="{ height: item.height + '%' }"
          ></div>
        </div>
      </div>

      <!-- Traffic Sources -->
      <div class="grid grid-cols-4 gap-1">
        <div v-for="source in trafficSources" :key="source.name" 
             class="text-center p-2 rounded-lg" :class="source.bg">
          <div class="text-lg font-bold text-slate-700">
            <AnimatedCounter :target="source.value" :duration="1500" suffix="%" />
          </div>
          <div class="text-[8px] text-slate-500">{{ source.name }}</div>
        </div>
      </div>
    </div>

    <!-- Dashboard Admin Hôpital -->
    <div v-else-if="role === 'hospital-admin'" class="dashboard-hospital">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            H
          </div>
          <div>
            <h4 class="font-bold text-slate-800 text-sm">Hôpital Saint-Louis</h4>
            <p class="text-xs text-slate-500">Administration</p>
          </div>
        </div>
        <span class="text-2xl">🏥</span>
      </div>

      <div class="grid grid-cols-3 gap-2 mb-4">
        <div class="bg-emerald-50 p-2 rounded-xl text-center">
          <div class="text-xl font-bold text-emerald-600">
            <AnimatedCounter :target="24" :duration="2000" />
          </div>
          <div class="text-[10px] text-slate-500">Services</div>
        </div>
        <div class="bg-amber-50 p-2 rounded-xl text-center">
          <div class="text-xl font-bold text-amber-600">
            <AnimatedCounter :target="156" :duration="2000" />
          </div>
          <div class="text-[10px] text-slate-500">Personnel</div>
        </div>
        <div class="bg-cyan-50 p-2 rounded-xl text-center">
          <div class="text-xl font-bold text-cyan-600">
            <AnimatedCounter :target="87" :duration="2000" suffix="%" />
          </div>
          <div class="text-[10px] text-slate-500">Occup. lits</div>
        </div>
      </div>

      <div class="bg-slate-50 p-3 rounded-xl">
        <div class="flex justify-between text-xs text-slate-600 mb-2">
          <span>Activité par service</span>
          <span class="text-purple-600">Détails</span>
        </div>
        <div class="space-y-2">
          <div v-for="service in hospitalServices" :key="service.name" class="flex items-center gap-2">
            <span class="text-[10px] font-medium w-14">{{ service.name }}</span>
            <div class="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div class="h-full transition-all duration-1000" 
                   :class="service.color"
                   :style="{ width: service.percentage + '%' }"
              ></div>
            </div>
            <span class="text-[10px] text-slate-500 w-8">
              <AnimatedCounter :target="service.percentage" :duration="1500" suffix="%" />
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard Super Admin -->
    <div v-else-if="role === 'super-admin'" class="dashboard-super">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg">
            SA
          </div>
          <div>
            <h4 class="font-bold text-slate-800 text-sm">Super Admin</h4>
            <p class="text-xs text-slate-500">Supervision globale</p>
          </div>
        </div>
        <div class="flex gap-1">
          <span class="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-xs">⚙️</span>
        </div>
      </div>

      <div class="grid grid-cols-4 gap-1 mb-4">
        <div class="bg-slate-50 p-2 rounded-xl text-center">
          <div class="text-lg font-bold text-slate-700">
            <AnimatedCounter :target="1247" :duration="2000" />
          </div>
          <div class="text-[8px] text-slate-500">Utilisateurs</div>
        </div>
        <div class="bg-slate-50 p-2 rounded-xl text-center">
          <div class="text-lg font-bold text-slate-700">
            <AnimatedCounter :target="4825" :duration="2000" />
          </div>
          <div class="text-[8px] text-slate-500">Requêtes</div>
        </div>
        <div class="bg-slate-50 p-2 rounded-xl text-center">
          <div class="text-lg font-bold text-slate-700">
            <AnimatedCounter :target="98" :duration="2000" suffix="%" />
          </div>
          <div class="text-[8px] text-slate-500">Uptime</div>
        </div>
        <div class="bg-slate-50 p-2 rounded-xl text-center">
          <div class="text-lg font-bold text-slate-700">
            <AnimatedCounter :target="12" :duration="2000" />
          </div>
          <div class="text-[8px] text-slate-500">Alertes</div>
        </div>
      </div>

      <div class="bg-slate-50 p-3 rounded-xl">
        <div class="flex justify-between text-xs text-slate-600 mb-2">
          <span>Activité système</span>
          <span class="text-amber-600">Voir logs</span>
        </div>
        <div class="space-y-1.5">
          <div v-for="log in systemLogs" :key="log.time" class="flex items-center gap-2 text-xs">
            <span class="h-2 w-2 rounded-full" :class="log.status"></span>
            <span class="text-slate-500">{{ log.message }}</span>
            <span class="ml-auto text-slate-400">{{ log.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AnimatedCounter from './AnimatedCounter.vue'

const props = defineProps({
  role: {
    type: String,
    required: true
  }
})

// Données patient
const patientData = [
  { label: 'Lun', height: 60 },
  { label: 'Mar', height: 75 },
  { label: 'Mer', height: 45 },
  { label: 'Jeu', height: 85 },
  { label: 'Ven', height: 65 },
  { label: 'Sam', height: 55 }
]

// Données docteur revenue
const doctorRevenueData = [
  { height: 60 },
  { height: 75 },
  { height: 45 },
  { height: 90 },
  { height: 70 },
  { height: 55 },
  { height: 80 }
]

// Traffic sources
const trafficSources = [
  { name: 'Direct', value: 35, bg: 'bg-blue-50' },
  { name: 'Organic', value: 28, bg: 'bg-green-50' },
  { name: 'Referral', value: 22, bg: 'bg-purple-50' },
  { name: 'Social', value: 15, bg: 'bg-amber-50' }
]

// Services hospitaliers
const hospitalServices = [
  { name: 'Urgences', percentage: 85, color: 'bg-rose-500' },
  { name: 'Chirurgie', percentage: 62, color: 'bg-blue-500' },
  { name: 'Radio', percentage: 43, color: 'bg-amber-500' },
  { name: 'Cardio', percentage: 71, color: 'bg-red-500' }
]

// Logs système
const systemLogs = [
  { message: 'Système opérationnel', status: 'bg-green-500', time: '12:30' },
  { message: 'Maintenance planifiée', status: 'bg-amber-500', time: '11:15' },
  { message: 'Sauvegarde terminée', status: 'bg-green-500', time: '09:45' }
]
</script>

<style scoped>
.dashboard-container {
  font-family: system-ui, -apple-system, sans-serif;
}

.dashboard-patient,
.dashboard-doctor,
.dashboard-hospital,
.dashboard-super {
  width: 100%;
  padding: 0.5rem;
}

/* Animation des barres */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Effets de survol */
.bg-slate-50:hover,
.bg-blue-50:hover,
.bg-green-50:hover {
  transform: scale(1.02);
  transition: transform 0.2s ease;
}
</style>