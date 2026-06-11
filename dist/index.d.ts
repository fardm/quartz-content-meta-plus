import { QuartzTransformerPlugin } from '@quartz-community/types';
export { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps, QuartzTransformerPlugin } from '@quartz-community/types';
export { ContentMetaPlus, ContentMetaPlusOptions } from './components/index.js';

interface WordCountPlusOptions {
}
declare const WordCountPlus: QuartzTransformerPlugin<Partial<WordCountPlusOptions>>;
declare module "vfile" {
    interface DataMap {
        wordCount: number;
    }
}

export { WordCountPlus, type WordCountPlusOptions };
