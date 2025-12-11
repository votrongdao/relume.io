"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Sitemap, SitemapNode, GeneratedPage, PageStatus } from "./types";

interface SitemapState {
  sitemaps: Sitemap[];
  currentSitemap: Sitemap | null;
  generatedPages: GeneratedPage[];
  isGenerating: boolean;

  // Actions
  addSitemap: (sitemap: Sitemap) => void;
  setCurrentSitemap: (sitemap: Sitemap | null) => void;
  updateSitemap: (id: string, updates: Partial<Sitemap>) => void;
  deleteSitemap: (id: string) => void;

  // Node actions
  addNode: (sitemapId: string, node: SitemapNode, parentId?: string) => void;
  updateNode: (sitemapId: string, nodeId: string, updates: Partial<SitemapNode>) => void;
  deleteNode: (sitemapId: string, nodeId: string) => void;
  updateNodeStatus: (sitemapId: string, nodeId: string, status: PageStatus) => void;

  // Generation actions
  addGeneratedPage: (page: GeneratedPage) => void;
  setGenerating: (isGenerating: boolean) => void;
  clearGeneratedPages: () => void;
}

function updateNodeInTree(
  nodes: SitemapNode[],
  nodeId: string,
  updates: Partial<SitemapNode>
): SitemapNode[] {
  return nodes.map((node) => {
    if (node.id === nodeId) {
      return { ...node, ...updates, updatedAt: new Date() };
    }
    if (node.children.length > 0) {
      return {
        ...node,
        children: updateNodeInTree(node.children, nodeId, updates),
      };
    }
    return node;
  });
}

function deleteNodeFromTree(nodes: SitemapNode[], nodeId: string): SitemapNode[] {
  return nodes
    .filter((node) => node.id !== nodeId)
    .map((node) => ({
      ...node,
      children: deleteNodeFromTree(node.children, nodeId),
    }));
}

function addNodeToTree(
  nodes: SitemapNode[],
  newNode: SitemapNode,
  parentId?: string
): SitemapNode[] {
  if (!parentId) {
    return [...nodes, newNode];
  }

  return nodes.map((node) => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...node.children, { ...newNode, parentId }],
      };
    }
    if (node.children.length > 0) {
      return {
        ...node,
        children: addNodeToTree(node.children, newNode, parentId),
      };
    }
    return node;
  });
}

export const useSitemapStore = create<SitemapState>()(
  persist(
    (set, get) => ({
      sitemaps: [],
      currentSitemap: null,
      generatedPages: [],
      isGenerating: false,

      addSitemap: (sitemap) =>
        set((state) => ({
          sitemaps: [...state.sitemaps, sitemap],
          currentSitemap: sitemap,
        })),

      setCurrentSitemap: (sitemap) => set({ currentSitemap: sitemap }),

      updateSitemap: (id, updates) =>
        set((state) => ({
          sitemaps: state.sitemaps.map((s) =>
            s.id === id ? { ...s, ...updates, updatedAt: new Date() } : s
          ),
          currentSitemap:
            state.currentSitemap?.id === id
              ? { ...state.currentSitemap, ...updates, updatedAt: new Date() }
              : state.currentSitemap,
        })),

      deleteSitemap: (id) =>
        set((state) => ({
          sitemaps: state.sitemaps.filter((s) => s.id !== id),
          currentSitemap:
            state.currentSitemap?.id === id ? null : state.currentSitemap,
        })),

      addNode: (sitemapId, node, parentId) =>
        set((state) => ({
          sitemaps: state.sitemaps.map((s) =>
            s.id === sitemapId
              ? { ...s, nodes: addNodeToTree(s.nodes, node, parentId) }
              : s
          ),
          currentSitemap:
            state.currentSitemap?.id === sitemapId
              ? {
                  ...state.currentSitemap,
                  nodes: addNodeToTree(state.currentSitemap.nodes, node, parentId),
                }
              : state.currentSitemap,
        })),

      updateNode: (sitemapId, nodeId, updates) =>
        set((state) => ({
          sitemaps: state.sitemaps.map((s) =>
            s.id === sitemapId
              ? { ...s, nodes: updateNodeInTree(s.nodes, nodeId, updates) }
              : s
          ),
          currentSitemap:
            state.currentSitemap?.id === sitemapId
              ? {
                  ...state.currentSitemap,
                  nodes: updateNodeInTree(state.currentSitemap.nodes, nodeId, updates),
                }
              : state.currentSitemap,
        })),

      deleteNode: (sitemapId, nodeId) =>
        set((state) => ({
          sitemaps: state.sitemaps.map((s) =>
            s.id === sitemapId
              ? { ...s, nodes: deleteNodeFromTree(s.nodes, nodeId) }
              : s
          ),
          currentSitemap:
            state.currentSitemap?.id === sitemapId
              ? {
                  ...state.currentSitemap,
                  nodes: deleteNodeFromTree(state.currentSitemap.nodes, nodeId),
                }
              : state.currentSitemap,
        })),

      updateNodeStatus: (sitemapId, nodeId, status) =>
        set((state) => ({
          sitemaps: state.sitemaps.map((s) =>
            s.id === sitemapId
              ? { ...s, nodes: updateNodeInTree(s.nodes, nodeId, { status }) }
              : s
          ),
          currentSitemap:
            state.currentSitemap?.id === sitemapId
              ? {
                  ...state.currentSitemap,
                  nodes: updateNodeInTree(state.currentSitemap.nodes, nodeId, { status }),
                }
              : state.currentSitemap,
        })),

      addGeneratedPage: (page) =>
        set((state) => ({
          generatedPages: [...state.generatedPages, page],
        })),

      setGenerating: (isGenerating) => set({ isGenerating }),

      clearGeneratedPages: () => set({ generatedPages: [] }),
    }),
    {
      name: "sitemap-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
