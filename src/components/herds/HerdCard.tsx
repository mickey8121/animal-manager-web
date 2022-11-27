import { FC, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { HERDS_ROUTE } from 'helpers/constants';

import { Herd } from 'generated/graphql';

interface Props {
  herd: Herd;
}

const herdImages = [
  'https://static.independent.co.uk/s3fs-public/thumbnails/image/2020/09/04/16/alpaca.jpg?width=982&height=726&auto=webp&quality=75',
  'https://images.theconversation.com/files/337593/original/file-20200526-106811-ql6d51.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1356&h=668&fit=crop',
  'https://media.istockphoto.com/photos/closeup-portrait-of-a-crazy-sheep-one-cute-little-lamb-with-funny-picture-id1200304083?k=6&m=1200304083&s=612x612&w=0&h=8m78a_mEFv-3zTf_EnkKFgmeSMjBUEwOHc68Jkf9DGA=',
  'https://www.sadanduseless.com/wp-content/uploads/2020/04/funny-hair-lol.png',
  'https://www.maxpixel.net/static/photo/1x/Funny-Alpaca-Feel-Good-Hairy-Nature-White-Lama-4454530.jpg',
  'https://www.scarymommy.com/wp-content/uploads/2020/06/kimmy-williams-IivEbEd_vQ4-unsplash.jpg',
  'https://i0.wp.com/themindcircle.com/wp-content/uploads/2015/06/funny-alpacas-with-awesome-amazing-hilarious-hair-25.jpg',
  'https://i.pinimg.com/600x315/0d/31/ee/0d31eeb7434aee2b095c3c7d6e24129c.jpg',
  'https://www.meme-arsenal.com/memes/dcbe2615eb79f0097f61a878c2ca4314.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLtC0WxTFLg6_MmeJRmup8GQCAHLEXW5t0BA&usqp=CAU',
];

const HerdCard: FC<Props> = ({ herd }) => {
  // temporary
  const herdImage = useMemo(
    () =>
      herdImages[
        herd.name.length > herdImages.length - 1
          ? herd.name.length - herdImages.length
          : herd.name.length
      ] ?? herdImages[0],
    [herd],
  );

  return (
    <Link className='herd-card' to={`/${HERDS_ROUTE}/${herd.id}`}>
      <div className='herd-image' style={{ backgroundImage: `url(${herdImage})` }} />
      <div className='herd-name'>{herd.name}</div>
    </Link>
  );
};

export default HerdCard;
