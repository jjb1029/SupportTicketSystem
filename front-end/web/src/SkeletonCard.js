import React from 'react';
import "./Dashboard.css";

function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton-title shimmer"></div>
            <div className="skeleton-line shimmer"></div>
            <div className="skeleton-line shimmer"></div>
        </div>
    );
}

export default SkeletonCard;