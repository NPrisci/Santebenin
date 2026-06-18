<script setup>
import { onBeforeUnmount, watch, ref, computed, nextTick } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import { StarterKit } from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import { Underline } from "@tiptap/extension-underline";
import { Highlight } from "@tiptap/extension-highlight";
import { TextAlign } from "@tiptap/extension-text-align";
import { Placeholder } from "@tiptap/extension-placeholder";
import { CharacterCount } from "@tiptap/extension-character-count";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";

/* ─── Props ─────────────────────────────────────────────────── */
const props = defineProps({
  modelValue: { type: String, default: "" },
  placeholder: {
    type: String,
    default: "Commencez à rédiger votre annonce...",
  },
  minWidth: { type: String, default: "320px" },
  minHeight: { type: String, default: "260px" },
  maxLength: { type: Number, default: 0 }, // 0 = illimité
});

const emit = defineEmits(["update:modelValue"]);

/* ─── Popups / menus ─────────────────────────────────────────── */
const showLinkPopup = ref(false);
const linkUrl = ref("");
const linkInputRef = ref(null);
const showTableMenu = ref(false);
const showHeadingMenu = ref(false);

/* ─── Fermeture globale des menus ────────────────────────────── */
const closeAllMenus = () => {
  showLinkPopup.value = false;
  showTableMenu.value = false;
  showHeadingMenu.value = false;
};

/* ─── Tiptap ────────────────────────────────────────────────── */
const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({ heading: { levels: [2, 3] } }),
    Underline,
    Highlight.configure({
      multicolor: false,
      HTMLAttributes: { class: "med-highlight" },
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      HTMLAttributes: { class: "med-link" },
    }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Placeholder.configure({ placeholder: props.placeholder }),
    CharacterCount.configure({
      limit: props.maxLength > 0 ? props.maxLength : null,
    }),
    Table.configure({
      resizable: true,
      HTMLAttributes: { class: "med-table" },
    }),
    TableRow,
    TableHeader,
    TableCell,
  ],
  onUpdate: ({ editor }) => emit("update:modelValue", editor.getHTML()),
  onSelectionUpdate: closeAllMenus,
});

watch(
  () => props.modelValue,
  (v) => {
    if (editor.value?.getHTML() !== v)
      editor.value?.commands.setContent(v, false);
  }
);

onBeforeUnmount(() => editor.value?.destroy());

/* ─── Compteurs ─────────────────────────────────────────────── */
const charCount = computed(
  () => editor.value?.storage.characterCount.characters() ?? 0
);
const wordCount = computed(
  () => editor.value?.storage.characterCount.words() ?? 0
);
const isOverLimit = computed(
  () => props.maxLength > 0 && charCount.value > props.maxLength
);

/* ─── Bloc courant (dropdown titres) ────────────────────────── */
const currentBlockLabel = computed(() => {
  if (!editor.value) return "Paragraphe";
  if (editor.value.isActive("heading", { level: 2 })) return "Titre H2";
  if (editor.value.isActive("heading", { level: 3 })) return "Sous-titre H3";
  return "Paragraphe";
});

const setBlockType = (type) => {
  if (!editor.value) return;
  const cmds = {
    paragraph: () => editor.value.chain().focus().setParagraph().run(),
    h2: () => editor.value.chain().focus().toggleHeading({ level: 2 }).run(),
    h3: () => editor.value.chain().focus().toggleHeading({ level: 3 }).run(),
  };
  cmds[type]?.();
  showHeadingMenu.value = false;
};

/* ─── Lien ───────────────────────────────────────────────────── */
const openLinkPopup = async () => {
  if (!editor.value) return;
  linkUrl.value = editor.value.getAttributes("link").href || "";
  showLinkPopup.value = true;
  await nextTick();
  linkInputRef.value?.focus();
};

const confirmLink = () => {
  if (!editor.value) return;
  const url = linkUrl.value.trim();
  if (!url) {
    editor.value.chain().focus().extendMarkRange("link").unsetLink().run();
  } else {
    const final = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    editor.value
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: final })
      .run();
  }
  closeLinkPopup();
};

const removeLink = () => {
  editor.value?.chain().focus().extendMarkRange("link").unsetLink().run();
  closeLinkPopup();
};

const closeLinkPopup = () => {
  showLinkPopup.value = false;
  linkUrl.value = "";
};

/* ─── Tableau ────────────────────────────────────────────────── */
const isInTable = computed(() => editor.value?.isActive("table") ?? false);

const insertTable = () => {
  editor.value
    ?.chain()
    .focus()
    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
    .run();
  showTableMenu.value = false;
};

const tbl = {
  addRow: () => editor.value?.chain().focus().addRowAfter().run(),
  addCol: () => editor.value?.chain().focus().addColumnAfter().run(),
  delRow: () => editor.value?.chain().focus().deleteRow().run(),
  delCol: () => editor.value?.chain().focus().deleteColumn().run(),
  delTable: () => {
    editor.value?.chain().focus().deleteTable().run();
    showTableMenu.value = false;
  },
};
</script>

<template>
  <div
    class="med-editor border rounded-lg bg-white overflow-hidden"
    :style="{ minWidth: minWidth }"
    @click.self="closeAllMenus"
  >
    <!-- ══════════════════════════════
         TOOLBAR
         ══════════════════════════════ -->
    <div
      v-if="editor"
      class="med-toolbar d-flex flex-wrap align-items-center gap-1 px-2 py-2 border-bottom bg-light"
    >
      <!-- Dropdown : type de bloc -->
      <div class="position-relative">
        <button
          type="button"
          class="tb-btn tb-btn--wide d-flex align-items-center gap-1"
          :title="`Style : ${currentBlockLabel}`"
          @click.stop="
            showHeadingMenu = !showHeadingMenu;
            showTableMenu = false;
            showLinkPopup = false;
          "
        >
          <i class="fa-solid fa-heading" style="font-size: 11px"></i>
          <span class="tb-label">{{ currentBlockLabel }}</span>
          <i
            class="fa-solid fa-chevron-down"
            style="font-size: 8px; opacity: 0.55"
          ></i>
        </button>

        <div v-if="showHeadingMenu" class="tb-dropdown" @click.stop>
          <button
            type="button"
            @click="setBlockType('paragraph')"
            :class="['tb-drop-item', { active: !editor.isActive('heading') }]"
          >
            Paragraphe
          </button>
          <button
            type="button"
            @click="setBlockType('h2')"
            :class="[
              'tb-drop-item tb-drop-item--h2',
              { active: editor.isActive('heading', { level: 2 }) },
            ]"
          >
            Titre H2
          </button>
          <button
            type="button"
            @click="setBlockType('h3')"
            :class="[
              'tb-drop-item tb-drop-item--h3',
              { active: editor.isActive('heading', { level: 3 }) },
            ]"
          >
            Sous-titre H3
          </button>
        </div>
      </div>

      <span class="tb-sep"></span>

      <!-- Gras -->
      <button
        type="button"
        :class="['tb-btn', { active: editor.isActive('bold') }]"
        title="Gras (Ctrl+B)"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <i class="fa-solid fa-bold"></i>
      </button>

      <!-- Italique -->
      <button
        type="button"
        :class="['tb-btn', { active: editor.isActive('italic') }]"
        title="Italique (Ctrl+I)"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <i class="fa-solid fa-italic"></i>
      </button>

      <!-- Souligné -->
      <button
        type="button"
        :class="['tb-btn', { active: editor.isActive('underline') }]"
        title="Souligné (Ctrl+U)"
        @click="editor.chain().focus().toggleUnderline().run()"
      >
        <i class="fa-solid fa-underline"></i>
      </button>

      <!-- Barré -->
      <button
        type="button"
        :class="['tb-btn', { active: editor.isActive('strike') }]"
        title="Barré"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        <i class="fa-solid fa-strikethrough"></i>
      </button>

      <!-- Surlignage -->
      <button
        type="button"
        :class="['tb-btn', { active: editor.isActive('highlight') }]"
        title="Surligner"
        @click="editor.chain().focus().toggleHighlight().run()"
      >
        <i class="fa-solid fa-highlighter"></i>
      </button>

      <!-- Code inline -->
      <button
        type="button"
        :class="['tb-btn', { active: editor.isActive('code') }]"
        title="Code inline"
        @click="editor.chain().focus().toggleCode().run()"
      >
        <i class="fa-solid fa-code"></i>
      </button>

      <span class="tb-sep"></span>

      <!-- Alignement gauche -->
      <button
        type="button"
        :class="['tb-btn', { active: editor.isActive({ textAlign: 'left' }) }]"
        title="Aligner à gauche"
        @click="editor.chain().focus().setTextAlign('left').run()"
      >
        <i class="fa-solid fa-align-left"></i>
      </button>

      <!-- Centrer -->
      <button
        type="button"
        :class="[
          'tb-btn',
          { active: editor.isActive({ textAlign: 'center' }) },
        ]"
        title="Centrer"
        @click="editor.chain().focus().setTextAlign('center').run()"
      >
        <i class="fa-solid fa-align-center"></i>
      </button>

      <!-- Aligner à droite -->
      <button
        type="button"
        :class="['tb-btn', { active: editor.isActive({ textAlign: 'right' }) }]"
        title="Aligner à droite"
        @click="editor.chain().focus().setTextAlign('right').run()"
      >
        <i class="fa-solid fa-align-right"></i>
      </button>

      <!-- Justifier -->
      <button
        type="button"
        :class="[
          'tb-btn',
          { active: editor.isActive({ textAlign: 'justify' }) },
        ]"
        title="Justifier"
        @click="editor.chain().focus().setTextAlign('justify').run()"
      >
        <i class="fa-solid fa-align-justify"></i>
      </button>

      <span class="tb-sep"></span>

      <!-- Liste à puces -->
      <button
        type="button"
        :class="['tb-btn', { active: editor.isActive('bulletList') }]"
        title="Liste à puces"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        <i class="fa-solid fa-list-ul"></i>
      </button>

      <!-- Liste ordonnée -->
      <button
        type="button"
        :class="['tb-btn', { active: editor.isActive('orderedList') }]"
        title="Liste ordonnée"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        <i class="fa-solid fa-list-ol"></i>
      </button>

      <!-- Citation -->
      <button
        type="button"
        :class="['tb-btn', { active: editor.isActive('blockquote') }]"
        title="Citation"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        <i class="fa-solid fa-quote-left"></i>
      </button>

      <!-- Séparateur horizontal -->
      <button
        type="button"
        class="tb-btn"
        title="Séparateur horizontal"
        @click="editor.chain().focus().setHorizontalRule().run()"
      >
        <!-- SVG car fa ne propose pas de ligne seule lisible en petit -->
        <svg
          width="13"
          height="10"
          viewBox="0 0 13 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <line
            x1="0"
            y1="5"
            x2="13"
            y2="5"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
          />
        </svg>
      </button>

      <span class="tb-sep"></span>

      <!-- Lien -->
      <div class="position-relative">
        <button
          type="button"
          :class="['tb-btn', { active: editor.isActive('link') }]"
          title="Insérer / modifier un lien"
          @click.stop="
            openLinkPopup();
            showHeadingMenu = false;
            showTableMenu = false;
          "
        >
          <i class="fa-solid fa-link"></i>
        </button>

        <!-- Mini popup lien -->
        <div
          v-if="showLinkPopup"
          class="tb-dropdown tb-link-popup d-flex align-items-center gap-1"
          @click.stop
        >
          <i class="fa-solid fa-globe tb-link-icon"></i>
          <input
            ref="linkInputRef"
            v-model="linkUrl"
            type="text"
            placeholder="https://exemple.com"
            class="tb-link-input"
            @keydown.enter.prevent="confirmLink"
            @keydown.escape="closeLinkPopup"
          />
          <!-- Valider -->
          <button
            type="button"
            class="tb-icon-btn tb-icon-btn--success"
            title="Valider"
            @click="confirmLink"
          >
            <i class="fa-solid fa-check"></i>
          </button>
          <!-- Supprimer le lien (si déjà un lien actif) -->
          <button
            v-if="editor.isActive('link')"
            type="button"
            class="tb-icon-btn tb-icon-btn--danger"
            title="Retirer le lien"
            @click="removeLink"
          >
            <i class="fa-solid fa-trash"></i>
          </button>
          <!-- Annuler -->
          <button
            type="button"
            class="tb-icon-btn"
            title="Annuler"
            @click="closeLinkPopup"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <!-- Tableau -->
      <div class="position-relative">
        <button
          type="button"
          :class="['tb-btn', { active: isInTable }]"
          title="Tableau"
          @click.stop="
            showTableMenu = !showTableMenu;
            showHeadingMenu = false;
            showLinkPopup = false;
          "
        >
          <i class="fa-solid fa-table"></i>
        </button>

        <div v-if="showTableMenu" class="tb-dropdown" @click.stop>
          <!-- Hors tableau : insérer -->
          <button
            v-if="!isInTable"
            type="button"
            class="tb-drop-item"
            @click="insertTable"
          >
            <i class="fa-solid fa-plus me-1" style="font-size: 10px"></i>
            Insérer un tableau 3x3
          </button>

          <!-- Dans le tableau : contrôles -->
          <template v-else>
            <button type="button" class="tb-drop-item" @click="tbl.addRow">
              <i class="fa-solid fa-plus me-1" style="font-size: 10px"></i
              >Ajouter une ligne
            </button>
            <button type="button" class="tb-drop-item" @click="tbl.addCol">
              <i class="fa-solid fa-plus me-1" style="font-size: 10px"></i
              >Ajouter une colonne
            </button>
            <button type="button" class="tb-drop-item" @click="tbl.delRow">
              <i class="fa-solid fa-minus me-1" style="font-size: 10px"></i
              >Supprimer la ligne
            </button>
            <button type="button" class="tb-drop-item" @click="tbl.delCol">
              <i class="fa-solid fa-minus me-1" style="font-size: 10px"></i
              >Supprimer la colonne
            </button>
            <div class="tb-drop-sep"></div>
            <button
              type="button"
              class="tb-drop-item tb-drop-item--danger"
              @click="tbl.delTable"
            >
              <i class="fa-solid fa-trash me-1" style="font-size: 10px"></i
              >Supprimer le tableau
            </button>
          </template>
        </div>
      </div>

      <span class="tb-sep"></span>

      <!-- Annuler -->
      <button
        type="button"
        class="tb-btn"
        title="Annuler (Ctrl+Z)"
        :disabled="!editor.can().undo()"
        @click="editor.chain().focus().undo().run()"
      >
        <i class="fa-solid fa-rotate-left"></i>
      </button>

      <!-- Rétablir -->
      <button
        type="button"
        class="tb-btn"
        title="Rétablir (Ctrl+Y)"
        :disabled="!editor.can().redo()"
        @click="editor.chain().focus().redo().run()"
      >
        <i class="fa-solid fa-rotate-right"></i>
      </button>
    </div>

    <!-- ══════════════════════════════
         ZONE D'ÉDITION
         ══════════════════════════════ -->
    <EditorContent
      :editor="editor"
      class="med-content"
      :style="{ minHeight: minHeight }"
      @click="closeAllMenus"
    />

    <!-- ══════════════════════════════
         FOOTER — compteur
         ══════════════════════════════ -->
    <div
      v-if="editor"
      class="med-footer d-flex justify-content-between align-items-center px-3 py-1 border-top bg-light"
    >
      <span class="med-footer__hint">
        <i
          class="fa-solid fa-circle-info me-1"
          style="font-size: 10px; opacity: 0.5"
        ></i>
        Mise en forme médicale enrichie
      </span>
      <span class="med-footer__count" :class="{ 'text-danger': isOverLimit }">
        {{ wordCount }} mot{{ wordCount === 1 ? "" : "s" }}
        &nbsp;·&nbsp;
        {{ charCount }}{{ maxLength > 0 ? ` / ${maxLength}` : "" }} car.
      </span>
    </div>
  </div>
</template>

<style scoped>
/* ───────────────────────────────────────────────
   CONTENEUR
   ─────────────────────────────────────────────── */
.med-editor {
  font-family: "Calibri", "Calibri Local", Calibri, sans-serif;
  border-color: var(--medical-gray-200) !important;
  border-radius: var(--radius-lg) !important;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  transition: box-shadow var(--transition-fast),
    border-color var(--transition-fast);
}

.med-editor:focus-within {
  border-color: var(--medical-primary) !important;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15), var(--shadow-sm);
}

/* ───────────────────────────────────────────────
   TOOLBAR
   ─────────────────────────────────────────────── */
.med-toolbar {
  background-color: var(--medical-gray-50) !important;
  border-bottom-color: var(--medical-gray-200) !important;
}

/* Bouton de base */
.tb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--medical-gray-600);
  font-size: 12px;
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
  line-height: 1;
  font-family: inherit;
}

.tb-btn:hover:not(:disabled) {
  background-color: var(--medical-gray-200);
  color: var(--medical-gray-900);
}

.tb-btn.active {
  background-color: var(--medical-primary-bg);
  color: var(--medical-primary);
}

.tb-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* Bouton large (dropdown bloc) */
.tb-btn--wide {
  width: auto;
  padding: 0 0.55rem;
  gap: 5px;
}

.tb-label {
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

/* Séparateur vertical */
.tb-sep {
  display: inline-block;
  width: 1px;
  height: 1.25rem;
  background: var(--medical-gray-200);
  margin: 0 3px;
  flex-shrink: 0;
}

/* ───────────────────────────────────────────────
   DROPDOWNS (titres + tableau)
   ─────────────────────────────────────────────── */
.tb-dropdown {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  z-index: 40;
  min-width: 185px;
  background: var(--medical-white);
  border: 1px solid var(--medical-gray-200);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  animation: tbDropIn 0.13s ease-out both;
}

@keyframes tbDropIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tb-drop-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.375rem 0.6rem;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  font-family: "Calibri", Calibri, sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--medical-gray-700);
  cursor: pointer;
  text-align: left;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.tb-drop-item:hover {
  background: var(--medical-gray-100);
}
.tb-drop-item.active {
  background: var(--medical-primary-bg);
  color: var(--medical-primary);
  font-weight: 700;
}
.tb-drop-item--h2 {
  font-size: 0.95rem;
  font-weight: 800;
}
.tb-drop-item--h3 {
  font-size: 0.88rem;
  font-weight: 700;
}

.tb-drop-item--danger {
  color: var(--medical-accent-danger);
}
.tb-drop-item--danger:hover {
  background: #fef2f2;
}

.tb-drop-sep {
  height: 1px;
  background: var(--medical-gray-200);
  margin: 3px 4px;
}

/* ───────────────────────────────────────────────
   POPUP LIEN
   ─────────────────────────────────────────────── */
.tb-link-popup {
  min-width: 290px;
  flex-direction: row !important;
  padding: 5px 6px;
}

.tb-link-icon {
  font-size: 11px;
  color: var(--medical-gray-400);
  flex-shrink: 0;
  margin-left: 2px;
}

.tb-link-input {
  flex: 1;
  border: none;
  outline: none;
  font-family: var(--code-family, "JetBrains Mono", monospace);
  font-size: 0.78rem;
  color: var(--medical-gray-800);
  padding: 2px 4px;
  background: transparent;
  min-width: 0;
}

/* Boutons icône compacts (popup lien) */
.tb-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.65rem;
  height: 1.65rem;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--medical-gray-500);
  font-size: 11px;
  cursor: pointer;
  flex-shrink: 0;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.tb-icon-btn:hover {
  background: var(--medical-gray-100);
}
.tb-icon-btn--success {
  color: var(--medical-accent-success);
}
.tb-icon-btn--success:hover {
  background: #d1fae5;
}
.tb-icon-btn--danger {
  color: var(--medical-gray-400);
}
.tb-icon-btn--danger:hover {
  background: #fef2f2;
  color: var(--medical-accent-danger);
}

/* ───────────────────────────────────────────────
   ZONE D'ÉDITION PROSEMIRROR
   ─────────────────────────────────────────────── */
.med-content {
  flex: 1;
  padding: 1.1rem 1.25rem;
  background: var(--medical-white);
  font-family: "Calibri", Calibri, sans-serif;
  font-size: 1rem;
  line-height: 1.65;
  color: var(--medical-gray-800);
  overflow-y: auto;
}

:deep(.ProseMirror) {
  outline: none;
  min-height: inherit;
  font-family: "Calibri", Calibri, sans-serif;
}

/* Placeholder */
:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: var(--medical-gray-400);
  pointer-events: none;
  height: 0;
  font-style: italic;
}

/* Titres */
:deep(.ProseMirror h2) {
  font-family: "Calibri", Calibri, sans-serif;
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--medical-gray-900);
  margin-top: 1.4rem;
  margin-bottom: 0.45rem;
  border-bottom: 2px solid var(--medical-primary-bg);
  padding-bottom: 0.2rem;
}

:deep(.ProseMirror h3) {
  font-family: "Calibri", Calibri, sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--medical-gray-800);
  margin-top: 1.15rem;
  margin-bottom: 0.35rem;
}

/* Paragraphes */
:deep(.ProseMirror p) {
  font-family: "Calibri", Calibri, sans-serif;
  margin-bottom: 0.7rem;
}

/* Listes */
:deep(.ProseMirror ul) {
  list-style-type: disc;
  padding-left: 1.6rem;
  margin-bottom: 0.7rem;
}

:deep(.ProseMirror ol) {
  list-style-type: decimal;
  padding-left: 1.6rem;
  margin-bottom: 0.7rem;
}

:deep(.ProseMirror li) {
  margin-bottom: 0.2rem;
}

/* Citation */
:deep(.ProseMirror blockquote) {
  border-left: 3px solid var(--medical-primary);
  background: var(--medical-primary-bg);
  margin: 0 0 0.75rem;
  padding: 0.6rem 1rem;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  color: var(--medical-gray-700);
  font-style: italic;
}

:deep(.ProseMirror blockquote p) {
  margin-bottom: 0;
}

/* Code inline */
:deep(.ProseMirror code) {
  font-family: var(--code-family, "JetBrains Mono", monospace);
  font-size: 0.82rem;
  background: var(--medical-gray-100);
  color: var(--medical-gray-800);
  padding: 0.1rem 0.35rem;
  border-radius: var(--radius-sm);
}

/* Bloc code */
:deep(.ProseMirror pre) {
  font-family: var(--code-family, "JetBrains Mono", monospace);
  font-size: 0.82rem;
  background: var(--medical-gray-900);
  color: var(--medical-gray-50);
  padding: 0.85rem 1rem;
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin-bottom: 0.75rem;
}

:deep(.ProseMirror pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
}

/* Séparateur */
:deep(.ProseMirror hr) {
  border: none;
  border-top: 1px solid var(--medical-gray-200);
  margin: 1.2rem 0;
}

/* Surlignage */
:deep(.med-highlight) {
  background-color: #fef9c3;
  border-radius: 2px;
  padding: 1px 3px;
}

/* Lien */
:deep(.med-link) {
  color: var(--medical-primary);
  text-decoration: underline;
  cursor: pointer;
}

:deep(.med-link:hover) {
  color: var(--medical-primary-dark);
}

/* ───────────────────────────────────────────────
   TABLEAUX
   ─────────────────────────────────────────────── */
:deep(.ProseMirror table) {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  margin-bottom: 0.75rem;
  overflow: hidden;
}

:deep(.ProseMirror table td),
:deep(.ProseMirror table th) {
  min-width: 1em;
  border: 1px solid var(--medical-gray-200);
  padding: 0.45rem 0.6rem;
  vertical-align: top;
  box-sizing: border-box;
  position: relative;
}

:deep(.ProseMirror table th) {
  background: var(--medical-gray-50);
  font-weight: 500;
  font-size: 16px;
  text-align: left;
  color: var(--medical-gray-700);
}

:deep(.ProseMirror table td) {
   font-size: 12px;
}

:deep(.ProseMirror table .selectedCell) {
  background: var(--medical-primary-bg);
}

:deep(.ProseMirror table .column-resize-handle) {
  position: absolute;
  right: -2px;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: var(--medical-primary);
  pointer-events: none;
}

:deep(.ProseMirror table p) {
  margin-bottom: 0;
}

/* ───────────────────────────────────────────────
   FOOTER
   ─────────────────────────────────────────────── */
.med-footer {
  background-color: var(--medical-gray-50) !important;
  border-top-color: var(--medical-gray-200) !important;
}

.med-footer__hint {
  font-family: "Calibri", Calibri, sans-serif;
  font-size: 0.72rem;
  color: var(--medical-gray-400);
  font-weight: 500;
}

.med-footer__count {
  font-family: "Calibri", Calibri, sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--medical-gray-400);
  font-variant-numeric: tabular-nums;
  transition: color var(--transition-fast);
}

.med-footer__count.text-danger {
  color: var(--medical-accent-danger) !important;
}
</style>