import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PreviewDevice = "desktop" | "tablet" | "mobile";
export type BuilderTab = "canvas" | "settings" | "theme";
export type ModalType = "aiPrompt" | "deleteConfirm" | "integrationConnect";

export interface UIState {
  sidebarOpen: boolean;
  previewDevice: PreviewDevice;
  activeBuilderTab: BuilderTab;
  modals: Record<ModalType, boolean>;
}

const initialState: UIState = {
  sidebarOpen: true,
  previewDevice: "desktop",
  activeBuilderTab: "canvas",
  modals: {
    aiPrompt: false,
    deleteConfirm: false,
    integrationConnect: false,
  },
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setPreviewDevice: (state, action: PayloadAction<PreviewDevice>) => {
      state.previewDevice = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<BuilderTab>) => {
      state.activeBuilderTab = action.payload;
    },
    openModal: (state, action: PayloadAction<ModalType>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<ModalType>) => {
      state.modals[action.payload] = false;
    },
  },
});

export const {
  toggleSidebar,
  setPreviewDevice,
  setActiveTab,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;
