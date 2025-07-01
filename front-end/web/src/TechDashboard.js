// Tech view of the dashboard
// techs will not be able to create tickets, just cause, the cards will have accept ticket and mark as completed?

import TicketDetailsModal from './TicketDetailsModal';
import React, {useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import "./Dashboard.css";
import SkeletonCard from "./SkeletonCard.js";
import "./Skeleton.css";