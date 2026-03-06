import { Injectable } from '@angular/core';
import { DATA_CONFIG } from '../data-config';

/**
 * Lê datasets de POSICIONAMENTO em “cenário real” a partir de:
 * - assets/data/sentiment/cenario-real/datasets.json
 * - cada dataset aponta para commentsFile e bootstrapFile
 *
 * Não altera o SentimentService antigo.
 */
@Injectable({ providedIn: 'root' })
export class SentimentRealService {
  private base: string;

  constructor() {
    if (DATA_CONFIG.BASE_DATA_URL) {
      this.base = `${DATA_CONFIG.BASE_DATA_URL}/sentiment/cenario-real`;
    } else {
      // respeita <base href> (GitHub Pages)
      const baseTag = document.getElementsByTagName('base')[0];
      const baseHref = (baseTag && baseTag.getAttribute('href')) || '/';
      const root = baseHref.endsWith('/') ? baseHref : baseHref + '/';
      this.base = `${root}assets/data/sentiment/cenario-real`;
    }
  }

  private async fetchJson<T = any>(url: string): Promise<T> {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status} @ ${url}`);
    return resp.json();
  }

  /** Lista os datasets (id -> { title, commentsFile, bootstrapFile }) */
  async getDatasets(): Promise<Record<string, { title: string; commentsFile: string; bootstrapFile: string }>> {
    const url = `${this.base}/datasets.json`;
    const data = await this.fetchJson(url);
    return data ?? {};
  }

  /**
   * Carrega um dataset: comentários + bootstrap.
   * Observação: os caminhos do datasets.json usam "data/..." – removemos esse prefixo,
   * pois a base já aponta para ".../sentiment/cenario-real".
   */
  async loadDataset(datasetId: string): Promise<{ meta: { id: string; title: string; total: number }, comments: any[], bootstrap: any[] }> {
    const all = await this.getDatasets();
    const cfg = all[datasetId];
    if (!cfg) throw new Error(`Dataset "${datasetId}" não encontrado.`);

    // normaliza caminhos removendo "data/"
    const commentsFile = this.resolve(`${cfg.commentsFile}`);
    const bootstrapFile = this.resolve(`${cfg.bootstrapFile}`);

    console.log("commentsFile:", commentsFile)

    const [comments, bootstrap] = await Promise.all([
      this.fetchJson<any[]>(commentsFile).catch(() => []),
      this.fetchJson<any[]>(bootstrapFile).catch(() => [])
    ]);

    return {
      meta: {
        id: datasetId,
        title: cfg.title,
        total: Array.isArray(comments) ? comments.length : 0
      },
      comments: Array.isArray(comments) ? comments : [],
      bootstrap: Array.isArray(bootstrap) ? bootstrap : []
    };
  }

  private resolve(input: string): string {
    // 1) URL absoluta
    if (/^https?:\/\//i.test(input)) return input;

    if (DATA_CONFIG.BASE_DATA_URL) {
      // No R2, as pastas estão na raiz
      if (input.startsWith('data/')) {
        return `${DATA_CONFIG.BASE_DATA_URL}/sentiment/cenario-real/${input.replace(/^data\//, '')}`;
      }
      if (input.startsWith('sentiment/')) {
        return `${DATA_CONFIG.BASE_DATA_URL}/${input}`;
      }
      if (input.startsWith('assets/')) {
        return `${DATA_CONFIG.BASE_DATA_URL}/${input.replace('assets/data/', '')}`;
      }
      return `${this.base}/${input}`;
    }

    // Comportamento original
    const baseTag = document.getElementsByTagName('base')[0];
    const baseHref = (baseTag && baseTag.getAttribute('href')) || '/';
    const root = baseHref.endsWith('/') ? baseHref : baseHref + '/';

    if (input.startsWith('assets/')) return `${root}${input}`;
    if (input.startsWith('data/')) return `${root}assets/data/sentiment/cenario-real/${input.replace(/^data\//, '')}`;
    if (input.startsWith('sentiment/')) return `${root}assets/data/${input}`;

    return `${this.base}/${input}`;
  }
}
