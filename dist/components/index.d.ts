import { QuartzComponent } from '@quartz-community/types';

interface ContentMetaPlusOptions {
    showReadingTime: boolean;
    showComma: boolean;
}
declare const _default: (opts?: Partial<ContentMetaPlusOptions>) => QuartzComponent;

export { _default as ContentMetaPlus, type ContentMetaPlusOptions };
