import { Router } from 'express';
import { getSitemapXml } from './sitemap.controller.js';

const router = Router();

router.get('/', getSitemapXml);

export default router;
