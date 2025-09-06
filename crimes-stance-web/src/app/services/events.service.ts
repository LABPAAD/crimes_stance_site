import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EventsService {
    private base = '/assets/data/events';

    private async fetchJson(fileName: string): Promise<any> {
        try {
            const resp = await fetch(`${this.base}/${fileName}`);
            if (!resp.ok) return null;
            return resp.json();
        } catch (e) {
            console.error('fetchJson error', fileName, e);
            return null;
        }
    }

    async listAll(): Promise<{ videos: any[]; metrics: any[]; videosByMonth: any[]; videosByYear: any[] }> {
        const [metrics, videos2024, videosPre] = await Promise.all([
            this.fetchJson('metrics_comparison.json'),
            this.fetchJson('videos_2024_onwards.json'),
            this.fetchJson('videos_pre_2024.json')
        ]);

        const videos: any[] = [];
        if (Array.isArray(videosPre)) videos.push(...videosPre);
        if (Array.isArray(videos2024)) videos.push(...videos2024);

        // normalize date field and parse dates
        const normalized = videos.map((v) => {
            const dateStr = v.data_postagem ?? v.date ?? v.day ?? null;
            let parsedDate = null;
            if (dateStr) {
                try {
                    parsedDate = new Date(dateStr);
                    if (isNaN(parsedDate.getTime())) parsedDate = null;
                } catch (e) {
                    parsedDate = null;
                }
            }
            return {
                ...v,
                data_postagem: dateStr,
                parsedDate
            };
        }).filter(v => v.parsedDate); // only keep videos with valid dates

        // aggregate by month and year
        const videosByMonth = this.aggregateByPeriod(normalized, 'month');
        const videosByYear = this.aggregateByPeriod(normalized, 'year');

        return { 
            videos: normalized, 
            metrics: Array.isArray(metrics) ? metrics : [],
            videosByMonth,
            videosByYear
        };
    }

    private aggregateByPeriod(videos: any[], period: 'month' | 'year'): any[] {
        const counts: Record<string, number> = {};
        
        for (const video of videos) {
            if (!video.parsedDate) continue;
            
            let key: string;
            if (period === 'month') {
                key = `${video.parsedDate.getFullYear()}-${String(video.parsedDate.getMonth() + 1).padStart(2, '0')}`;
            } else {
                key = String(video.parsedDate.getFullYear());
            }
            
            counts[key] = (counts[key] || 0) + 1;
        }
        
        return Object.entries(counts)
            .map(([period, count]) => ({ period, count }))
            .sort((a, b) => a.period.localeCompare(b.period));
    }

    // convenience: load only videos
    async getAllVideos(): Promise<any[]> {
        return (await this.listAll()).videos;
    }

    async getMetrics(): Promise<any[]> {
        return (await this.listAll()).metrics;
    }

    async getVideosByMonth(): Promise<any[]> {
        return (await this.listAll()).videosByMonth;
    }

    async getVideosByYear(): Promise<any[]> {
        return (await this.listAll()).videosByYear;
    }
}
