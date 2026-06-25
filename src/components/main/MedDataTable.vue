<script setup>
import { computed, ref, watch } from "vue";
import MedSkeleton from "@/components/common/MedSkeleton.vue";

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Object,
    default: () => null,
  },
  showRowNumber: {
    type: Boolean,
    default: true,
  },
  numberingFormat: {
    type: String,
    default: "sequential",
  },
  selectable: {
    type: Boolean,
    default: true,
  },
  searchable: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits([
  "page-change",
  "row-click",
  "rows-selected",
  "sort-change",
  "search-input",
]);

const searchQuery = ref("");
const sortColumn = ref(null);
const sortDirection = ref("asc");
const selectedRows = ref(new Set());

const filteredAndSortedItems = computed(() => {
  let result = [...props.items];

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter((item) => {
      return Object.values(item).some((value) => String(value).toLowerCase().includes(query));
    });
  }

  if (sortColumn.value) {
    result.sort((a, b) => {
      let valueA = a[sortColumn.value];
      let valueB = b[sortColumn.value];

      if (valueA === null || valueA === undefined) valueA = "";
      if (valueB === null || valueB === undefined) valueB = "";

      if (!isNaN(valueA) && !isNaN(valueB)) {
        valueA = Number(valueA);
        valueB = Number(valueB);
      } else {
        valueA = String(valueA).toLowerCase();
        valueB = String(valueB).toLowerCase();
      }

      if (valueA < valueB) {
        return sortDirection.value === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection.value === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  return result;
});

const totalColumns = computed(() => {
  let count = props.columns.length;
  if (props.selectable) count += 1;
  if (props.showRowNumber) count += 1;
  return count;
});

const paginationData = computed(() => {
  if (!props.pagination) return null;

  return {
    current_page:
      props.pagination.current_page ?? props.pagination.page ?? props.pagination.currentPage ?? 1,
    last_page:
      props.pagination.last_page ??
      props.pagination.total_pages ??
      props.pagination.totalPages ??
      props.pagination.lastPage ??
      1,
    total:
      props.pagination.total ?? props.pagination.total_items ?? props.pagination.totalItems ?? 0,
    per_page: props.pagination.per_page ?? props.pagination.perPage ?? null,
  };
});

const formatRowNumber = (index) => {
  switch (props.numberingFormat) {
    case "roman":
      return toRoman(index + 1);
    case "letter":
      return toLetter(index + 1);
    case "decimal":
      return String(index + 1).padStart(3, "0");
    case "sequential":
    default:
      return index + 1;
  }
};

const toRoman = (num) => {
  const romanMatrix = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let roman = "";
  for (const [value, symbol] of romanMatrix) {
    while (num >= value) {
      roman += symbol;
      num -= value;
    }
  }
  return roman;
};

const toLetter = (num) => {
  let letter = "";
  while (num > 0) {
    num--;
    letter = String.fromCharCode(65 + (num % 26)) + letter;
    num = Math.floor(num / 26);
  }
  return letter;
};

const handleSort = (column) => {
  if (column.sortable === false) return;

  if (sortColumn.value === column.key) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = column.key;
    sortDirection.value = "asc";
  }

  emit("sort-change", {
    column: sortColumn.value,
    direction: sortDirection.value,
  });
};

const toggleRowSelection = (itemId) => {
  if (selectedRows.value.has(itemId)) {
    selectedRows.value.delete(itemId);
  } else {
    selectedRows.value.add(itemId);
  }
  emitSelection();
};

const toggleSelectAll = () => {
  if (selectedRows.value.size === filteredAndSortedItems.value.length) {
    selectedRows.value.clear();
  } else {
    selectedRows.value.clear();
    filteredAndSortedItems.value.forEach((item) => {
      selectedRows.value.add(item.id || item);
    });
  }
  emitSelection();
};

const emitSelection = () => {
  const selectedItems = filteredAndSortedItems.value.filter((item) =>
    selectedRows.value.has(item.id || item),
  );
  emit("rows-selected", selectedItems);
};

const isRowSelected = (itemId) => {
  return selectedRows.value.has(itemId);
};

const isAllSelected = computed(() => {
  if (filteredAndSortedItems.value.length === 0) return false;
  return selectedRows.value.size === filteredAndSortedItems.value.length;
});

const handleSearch = (value) => {
  searchQuery.value = value;
  selectedRows.value.clear();
  emit("search-input", value);
};

const changePage = (page) => {
  if (!paginationData.value) return;

  if (page >= 1 && page <= paginationData.value.last_page) {
    emit("page-change", page);
  }
};

const handleRowClick = (item) => {
  emit("row-click", item);
};

watch(
  () => props.items,
  () => {
    const validIds = new Set(props.items.map((item) => item.id || item));
    selectedRows.value.forEach((id) => {
      if (!validIds.has(id)) {
        selectedRows.value.delete(id);
      }
    });
  },
);
</script>

<template>
  <div class="med-table-wrapper">
    <!-- Barre de recherche supérieure -->
    <div
      v-if="searchable"
      class="search-bar-container bg-white border rounded-top shadow-sm p-3 border-bottom-0"
    >
      <div class="input-group input-group-sm">
        <span class="input-group-text bg-light border-light">
          <i class="pi pi-search text-muted"></i>
        </span>
        <input
          type="text"
          class="form-control form-control-sm border-light bg-light"
          placeholder="Rechercher dans les données..."
          :value="searchQuery"
          @input="handleSearch($event.target.value)"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="btn btn-sm btn-ghost-secondary border-light"
          @click="handleSearch('')"
          title="Effacer la recherche"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>
      <small class="text-muted d-block mt-2 mb-0" v-if="searchQuery">
        {{ filteredAndSortedItems.length }} résultat(s) trouvé(s)
      </small>
    </div>

    <!-- Conteneur principal du tableau -->
    <div
      class="med-table-container bg-white border rounded shadow-sm overflow-hidden"
      :class="{ 'rounded-top-0': searchable }"
    >
      <!-- REPRISE DES CLASSES BOOTSTRAP RESPONSIVE -->
      <div class="table-responsive w-100 m-0">
        <table class="table table-hover align-middle mb-0 custom-med-table text-nowrap">
          <thead class="table-light text-uppercase tracking-wider text-muted border-bottom">
            <tr>
              <!-- Sélection globale -->
              <th
                v-if="selectable"
                scope="col"
                style="width: 45px; min-width: 45px"
                class="text-center px-3"
              >
                <div class="form-check d-flex justify-content-center align-items-center m-0">
                  <input
                    type="checkbox"
                    class="form-check-input m-0"
                    :id="`select-all-checkbox`"
                    :checked="isAllSelected"
                    @change="toggleSelectAll"
                  />
                  <label class="form-check-label" :for="`select-all-checkbox`"></label>
                </div>
              </th>

              <!-- Numérotation de ligne -->
              <th
                v-if="showRowNumber"
                scope="col"
                style="width: 60px; min-width: 60px"
                class="text-center px-2"
              >
                <span>N°</span>
              </th>

              <!-- En-têtes dynamiques -->
              <th
                v-for="col in columns"
                :key="col.key"
                scope="col"
                :style="{ width: col.width || 'auto', minWidth: col.width || 'auto' }"
                :class="[
                  col.align === 'end'
                    ? 'text-end'
                    : col.align === 'center'
                      ? 'text-center'
                      : 'text-start',
                  col.class || '',
                  col.sortable !== false ? 'sortable-header cursor-pointer' : '',
                  sortColumn === col.key ? 'sorted' : '',
                ]"
                @click="handleSort(col)"
              >
                <div
                  class="d-flex align-items-center gap-2"
                  :class="[
                    col.align === 'end'
                      ? 'justify-content-end'
                      : col.align === 'center'
                        ? 'justify-content-center'
                        : 'justify-content-between',
                  ]"
                >
                  <span>{{ col.label }}</span>
                  <template v-if="col.sortable !== false">
                    <i
                      v-if="sortColumn !== col.key"
                      class="pi pi-arrows-v text-muted opacity-50 text-xxs"
                    ></i>
                    <i
                      v-else-if="sortDirection === 'asc'"
                      class="pi pi-arrow-up text-primary text-xxs"
                    ></i>
                    <i v-else class="pi pi-arrow-down text-primary text-xxs"></i>
                  </template>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            <!-- Skeletons de chargement -->
            <template v-if="loading">
              <tr v-for="n in 5" :key="'sk-' + n">
                <td v-if="selectable" class="text-center py-3">
                  <MedSkeleton width="18px" height="18px" class="rounded mx-auto" />
                </td>
                <td v-if="showRowNumber" class="text-center py-3">
                  <MedSkeleton width="24px" height="16px" class="rounded mx-auto" />
                </td>
                <td v-for="col in columns" :key="'sk-td-' + col.key" class="py-3">
                  <MedSkeleton height="16px" class="rounded w-75" />
                </td>
              </tr>
            </template>

            <!-- Aucun enregistrement -->
            <tr v-else-if="filteredAndSortedItems.length === 0">
              <td :colspan="totalColumns" class="text-center py-5 text-nowrap-0">
                <div
                  class="d-flex flex-column align-items-center justify-content-center text-muted"
                >
                  <i
                    class="pi pi-inbox mb-2"
                    style="font-size: 1.8rem; color: var(--medical-gray-400)"
                  ></i>
                  <span class="small fw-medium">
                    {{
                      searchQuery
                        ? "Aucun résultat trouvé pour votre recherche"
                        : "Aucune donnée disponible"
                    }}
                  </span>
                </div>
              </td>
            </tr>

            <!-- Rendu des lignes -->
            <template v-else>
              <tr
                v-for="(item, index) in filteredAndSortedItems"
                :key="item.id || index"
                class="cursor-pointer"
                :class="{ 'selected-row': isRowSelected(item.id || item) }"
                @click="handleRowClick(item)"
              >
                <!-- Checkbox de ligne -->
                <td v-if="selectable" class="text-center px-3" @click.stop>
                  <div class="form-check d-flex justify-content-center align-items-center m-0">
                    <input
                      type="checkbox"
                      class="form-check-input m-0"
                      :id="`row-checkbox-${index}`"
                      :checked="isRowSelected(item.id || item)"
                      @change="toggleRowSelection(item.id || item)"
                    />
                    <label class="form-check-label" :for="`row-checkbox-${index}`"></label>
                  </div>
                </td>

                <!-- Numéro de ligne -->
                <td
                  v-if="showRowNumber"
                  class="text-center text-muted fw-semibold font-monospace text-xs"
                >
                  {{ formatRowNumber(index) }}
                </td>

                <!-- Cellules de données personnalisables -->
                <td
                  v-for="col in columns"
                  :key="col.key"
                  :class="[
                    col.align === 'end'
                      ? 'text-end'
                      : col.align === 'center'
                        ? 'text-center'
                        : 'text-start',
                    col.cellClass || '',
                  ]"
                >
                  <slot
                    :name="`item(${col.key})`"
                    :item="item"
                    :value="item[col.key]"
                    :index="index"
                  >
                    <span class="text-sm text-dark">{{ item[col.key] }}</span>
                  </slot>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination inférieure -->
      <div
        v-if="paginationData && !loading && filteredAndSortedItems.length > 0"
        class="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 px-4 py-3 border-top bg-light-subtle select-none"
      >
        <div class="text-muted text-xs text-center text-sm-start">
          Affichage de la page
          <span class="fw-bold text-dark">{{ paginationData.current_page }}</span>
          sur
          <span class="fw-bold text-dark">{{ paginationData.last_page }}</span>
          <span class="mx-1">•</span> Total de
          <span class="fw-bold text-dark">{{ paginationData.total }}</span> entrées
          <template v-if="selectedRows.size > 0">
            <span class="mx-1">•</span>
            <span class="fw-bold text-primary">{{ selectedRows.size }} sélectionné(s)</span>
          </template>
        </div>

        <nav aria-label="Navigation de pages">
          <ul class="pagination pagination-sm mb-0 justify-content-center gap-1">
            <li class="page-item" :class="{ disabled: paginationData.current_page === 1 }">
              <button
                class="page-link rounded border-0"
                @click="changePage(1)"
                :disabled="paginationData.current_page === 1"
              >
                <i class="pi pi-angle-double-left text-xs"></i>
              </button>
            </li>
            <li class="page-item" :class="{ disabled: paginationData.current_page === 1 }">
              <button
                class="page-link rounded border-0"
                @click="changePage(paginationData.current_page - 1)"
                :disabled="paginationData.current_page === 1"
              >
                <i class="pi pi-angle-left text-xs"></i>
              </button>
            </li>
            <li class="page-item active">
              <span class="page-link rounded font-monospace fw-bold px-3 border-0">
                {{ paginationData.current_page }}
              </span>
            </li>
            <li
              class="page-item"
              :class="{ disabled: paginationData.current_page === paginationData.last_page }"
            >
              <button
                class="page-link rounded border-0"
                @click="changePage(paginationData.current_page + 1)"
                :disabled="paginationData.current_page === paginationData.last_page"
              >
                <i class="pi pi-angle-right text-xs"></i>
              </button>
            </li>
            <li
              class="page-item"
              :class="{ disabled: paginationData.current_page === paginationData.last_page }"
            >
              <button
                class="page-link rounded border-0"
                @click="changePage(paginationData.last_page)"
                :disabled="paginationData.current_page === paginationData.last_page"
              >
                <i class="pi pi-angle-double-right text-xs"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped>
.med-table-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Forcer la barre responsive à ne pas casser le design externe */
.table-responsive {
  scrollbar-width: thin; /* Pour Firefox */
}

.custom-med-table {
  width: 100%;
  table-layout: auto;
}

.custom-med-table thead th {
  font-family: var(--body-family);
  font-size: 0.72rem;
  letter-spacing: 0.05em;
  padding: 0.85rem 1rem;
  background-color: var(--medical-gray-50, #f8f9fa);
  color: var(--medical-gray-500, #6c757d) !important;
  font-weight: 600;
  border-bottom-width: 1px;
  vertical-align: middle;
}

.custom-med-table thead th.sortable-header {
  user-select: none;
  transition: background-color 0.15s ease-in-out;
}

.custom-med-table thead th.sortable-header:hover {
  background-color: var(--medical-gray-100, #e9ecef);
}

.custom-med-table thead th.sorted {
  background-color: var(--medical-primary-bg, #f0f9ff);
  color: var(--medical-primary, #0284c7) !important;
}

.custom-med-table tbody td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--medical-gray-100, #dee2e6);
  vertical-align: middle;
}

.custom-med-table tbody tr {
  transition: background-color 0.15s ease-in-out;
}

.custom-med-table tbody tr:hover {
  background-color: var(--medical-primary-bg, #f0f9ff) !important;
}

.custom-med-table tbody tr.selected-row {
  background-color: var(--medical-primary-bg, #e0f2fe) !important;
  box-shadow: inset 3px 0 0 0 var(--medical-primary, #0284c7);
}

.form-check-input {
  border-color: var(--medical-gray-300, #ced4da);
  cursor: pointer;
  width: 1rem;
  height: 1rem;
}

.form-check-input:checked {
  background-color: var(--medical-primary, #0284c7);
  border-color: var(--medical-primary, #0284c7);
}

.text-nowrap-0 {
  white-space: normal !important;
}

.text-xxs {
  font-size: 0.65rem !important;
}

.text-xs {
  font-size: 0.78rem !important;
}

.text-sm {
  font-size: 0.88rem !important;
}

.pagination .page-item .page-link {
  color: var(--medical-gray-600);
  background-color: transparent;
  padding: 0.35rem 0.65rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  cursor: pointer;
}

.pagination .page-item.active .page-link {
  background-color: var(--medical-primary, #0284c7) !important;
  color: white !important;
}

.pagination .page-item.disabled .page-link {
  color: var(--medical-gray-300);
  pointer-events: none;
}
</style>
