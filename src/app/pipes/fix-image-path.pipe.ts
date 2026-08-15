import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fixImagePath', standalone: true })
export class FixImagePathPipe implements PipeTransform {
  transform(path: string | null | undefined): string {
    if (!path) return '';
    if (path.startsWith('http')) return path; // already a full URL, leave alone
    // strip any leading slash, then prefix with /zshop/
    const clean = path.startsWith('/') ? path.slice(1) : path;
    return `/zshop/${clean}`;
  }
}
