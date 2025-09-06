import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SentimentService {
  private base = '/assets/data/sentiment';

  private async fetchJson(fileName: string): Promise<any> {
    try {
      const resp = await fetch(`${this.base}/${fileName}`);
      if (!resp.ok) return null;
      return resp.json();
    } catch (e) {
      console.error('SentimentService.fetchJson error', fileName, e);
      return null;
    }
  }

  async listAll(): Promise<{ datasets: any; bootstrap: any[]; comments: any[] }> {
    const [datasets, bootstrap, comments] = await Promise.all([
      this.fetchJson('datasets.json'),
      this.fetchJson('bootstrap_results_211124.json'),
      this.fetchJson('comentarios_2021_nordeste_newBERT.json')
    ]);

    return {
      datasets: datasets ?? {},
      bootstrap: Array.isArray(bootstrap) ? bootstrap : [],
      comments: Array.isArray(comments) ? comments : []
    };
  }

  // convenience: counts of new_BERT values (-1,0,1)
  getSentimentCounts(comments: any[]): Record<string, number> {
    const counts: Record<string, number> = { '-1': 0, '0': 0, '1': 0 };
    for (const c of comments) {
      const val = String(c.new_BERT ?? '0');
      if (counts[val] === undefined) counts[val] = 0;
      counts[val]++;
    }
    return counts;
  }
}
