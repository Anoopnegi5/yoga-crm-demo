// Slug generator and URL matcher for Public Yogi Profiles
export function slugifyName(name: string): string {
  if (!name) return 'member';
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface UrlRouteInfo {
  isYogiProfile: boolean;
  isMembersDirectory: boolean;
  isPanel: boolean;
  isJoinLink: boolean;
  slug: string | null;
}

export function getSlugFromUrl(): UrlRouteInfo {
  const empty: UrlRouteInfo = { isYogiProfile: false, isMembersDirectory: false, isPanel: false, isJoinLink: false, slug: null };
  if (typeof window === 'undefined') return empty;

  const pathname = window.location.pathname;
  const search = window.location.search;
  const params = new URLSearchParams(search);

  // --- Clean path routing (primary) ---

  // /panel or /admin or /login
  if (pathname === '/panel' || pathname === '/admin' || pathname === '/login') {
    return { ...empty, isPanel: true };
  }

  // /join or /register
  if (pathname === '/join' || pathname === '/register') {
    return { ...empty, isJoinLink: true };
  }

  // /members or /yogis
  if (pathname === '/members' || pathname === '/member' || pathname === '/yogis') {
    return { ...empty, isMembersDirectory: true };
  }

  // /yogi/anoop-negi or /member/anoop-negi
  const pathParts = pathname.split('/').filter(Boolean);
  if (pathParts.length >= 2 && (pathParts[0] === 'yogi' || pathParts[0] === 'member')) {
    return { ...empty, isYogiProfile: true, slug: pathParts[1] };
  }

  // --- Legacy query parameter fallbacks (backward compatibility) ---

  if (search.includes('view=panel') || search.includes('admin=true') || search.includes('login=true')) {
    return { ...empty, isPanel: true };
  }

  if (search.includes('join=true') || search.includes('register=true') || search.includes('mode=client')) {
    return { ...empty, isJoinLink: true };
  }

  if (params.get('view') === 'members' || params.get('members') === 'true') {
    return { ...empty, isMembersDirectory: true };
  }

  const querySlug = params.get('yogi') || params.get('member');
  if (querySlug) {
    return { ...empty, isYogiProfile: true, slug: querySlug };
  }

  return empty;
}
