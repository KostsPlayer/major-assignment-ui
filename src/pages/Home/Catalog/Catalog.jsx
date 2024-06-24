import React from "react";
import { CatalogTitle, CatalogCursorTitle } from "./CatalogProperty";
import { LayoutImageCatalog } from "./Gallery";

export default function Catalog() {
  const { catalogTitle } = CatalogTitle();
  const { onEnterTitle, onLeaveTitle } = CatalogCursorTitle();

  return (
    <>
      <div className="catalog">
        <div className="catalog-title" ref={catalogTitle}>
          <span
            className="catalog-title-text"
            onMouseEnter={onEnterTitle}
            onMouseLeave={onLeaveTitle}
          >
            <span className="catalog-title-text-0">product</span>
          </span>
          <span
            className="catalog-title-text"
            onMouseEnter={onEnterTitle}
            onMouseLeave={onLeaveTitle}
          >
            <span className="catalog-title-text-1">catalogs</span>
          </span>
        </div>
        <div className="catalog-product">
          <LayoutImageCatalog />
        </div>
      </div>
    </>
  );
}
