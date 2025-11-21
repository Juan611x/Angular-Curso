import { Gif } from '../interfaces/gif.interface';
import { GiphyItem } from '../interfaces/giphy.interface';

export class GifMapper {
  static mapGiphyToGif(giphyData: GiphyItem): Gif {
    return {
      id: giphyData.id,
      title: giphyData.title,
      url: giphyData.images.fixed_height.url,
    };
  }
  static mapGiphyListToGifList(giphyDataList: GiphyItem[]): Gif[] {
    return giphyDataList.map(this.mapGiphyToGif);
  }
}
