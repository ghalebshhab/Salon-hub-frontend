import { useMemo, useState } from "react";
import { Images, RefreshCw } from "lucide-react";
import useSalonWorkGallery from "../hooks/useSalonWorkGallery.js";
import WorkTile from "./gallery/WorkTile.jsx";
import WorkLightbox from "./gallery/WorkLightbox.jsx";
import WorkPublisher from "./gallery/WorkPublisher.jsx";
import {
  FEATURE_TILE_MIN,
  GALLERY_PREVIEW_COUNT,
  artistFilters,
  filterByArtist,
  gallerySummary,
} from "../model/workGallery.js";

function GallerySkeleton() {
  return (
    <div className="wk-grid" aria-hidden="true">
      {Array.from({ length: 6 }, (_, item) => (
        <span
          key={item}
          className={`wk-tile is-skeleton${item === 0 ? " is-large" : ""}`}
        />
      ))}
    </div>
  );
}

const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

/**
 * The salon's work as a photo mosaic. Tiles open a full view where guests
 * can move through the work and book the professional who made it.
 * `booking` is null where nobody books (the owner's pages).
 */
export default function SalonWorkGallery({ salonId, booking = null }) {
  const gallery = useSalonWorkGallery(salonId);
  const { items, loading, error, refetch, canPublish } = gallery;
  const [artistId, setArtistId] = useState(null);
  const [shownCount, setShownCount] = useState(GALLERY_PREVIEW_COUNT);
  const [openIndex, setOpenIndex] = useState(null);

  const artists = useMemo(() => artistFilters(items), [items]);
  const filtered = useMemo(
    () => filterByArtist(items, artistId),
    [items, artistId],
  );
  const summary = gallerySummary(items, gallery.totalItems);

  const shown = filtered.slice(0, shownCount);
  const hiddenHere = filtered.length - shown.length;
  // Filtering by one artist only sees the pages loaded so far.
  const canLoadMore = !artistId && !hiddenHere && gallery.hasMore;

  const pickArtist = (id) => {
    setArtistId(id);
    setShownCount(GALLERY_PREVIEW_COUNT);
  };

  const deleteItem = async (item) => {
    if (await gallery.remove(item.id)) setOpenIndex(null);
  };

  const publisher = canPublish && <WorkPublisher {...gallery} />;

  if (loading) {
    return (
      <div className="wk">
        {publisher}
        <GallerySkeleton />
      </div>
    );
  }

  if (error && !items.length) {
    return (
      <div className="wk-empty" role="alert">
        <h3>The gallery could not be loaded</h3>
        <p>Check your connection and try again.</p>
        <button className="btn btn-secondary" type="button" onClick={refetch}>
          <RefreshCw size={16} aria-hidden="true" />
          Try again
        </button>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="wk">
        {publisher}
        <div className="wk-empty">
          <span className="wk-empty-icon" aria-hidden="true">
            <Images size={24} />
          </span>
          <h3>No work published yet</h3>
          <p>
            {canPublish
              ? "Share your first photo or video to show guests what you do."
              : "Photos and videos from the team will show here soon."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="wk">
      {publisher}

      <div className="wk-top">
        <p className="wk-summary">
          {summary.photos > 0 && plural(summary.photos, "photo")}
          {summary.photos > 0 && summary.videos > 0 && " · "}
          {summary.videos > 0 && plural(summary.videos, "video")}
          {summary.artists > 1 && ` · by ${summary.artists} professionals`}
        </p>
        {artists.length > 1 && (
          <div className="wk-filters" role="group" aria-label="Show work by">
            <button
              type="button"
              className="wk-chip"
              aria-pressed={artistId === null}
              onClick={() => pickArtist(null)}
            >
              All
            </button>
            {artists.map((artist) => (
              <button
                key={artist.id}
                type="button"
                className="wk-chip"
                aria-pressed={artistId === artist.id}
                onClick={() => pickArtist(artist.id)}
              >
                {artist.name}
                <span className="wk-chip-count">{artist.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <ul className="wk-grid">
        {shown.map((item, index) => (
          <li
            key={item.id}
            className={
              index === 0 && shown.length >= FEATURE_TILE_MIN
                ? "is-large"
                : undefined
            }
          >
            <WorkTile
              item={item}
              large={index === 0 && shown.length >= FEATURE_TILE_MIN}
              onOpen={() => setOpenIndex(index)}
            />
          </li>
        ))}
      </ul>

      {(hiddenHere > 0 || canLoadMore) && (
        <button
          type="button"
          className="btn btn-secondary wk-more"
          disabled={gallery.loadingMore}
          onClick={() =>
            hiddenHere > 0
              ? setShownCount((count) => count + GALLERY_PREVIEW_COUNT)
              : gallery
                  .loadMore()
                  .then(() =>
                    setShownCount((count) => count + GALLERY_PREVIEW_COUNT),
                  )
          }
        >
          {gallery.loadingMore
            ? "Loading…"
            : hiddenHere > 0
              ? `Show ${Math.min(hiddenHere, GALLERY_PREVIEW_COUNT)} more`
              : "Load more work"}
        </button>
      )}

      {openIndex !== null && shown[openIndex] && (
        <WorkLightbox
          items={shown}
          index={openIndex}
          onIndex={setOpenIndex}
          onClose={() => setOpenIndex(null)}
          booking={booking}
          canDelete={gallery.isOwnItem}
          onDelete={deleteItem}
        />
      )}
    </div>
  );
}
