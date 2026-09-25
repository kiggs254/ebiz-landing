/**
 * The E-biz mobile app download.
 *
 * ONE place to change when a new APK is built. Rebuilds are rare — day-to-day
 * changes ship over the air to installed phones via EAS Update, and only a
 * native change (a new native package, a permission, Firebase or Maps keys)
 * needs a fresh binary.
 *
 * The URL below is permanent and needs no editing: GitHub's `releases/latest`
 * always redirects to the newest release asset, so publishing a new release in
 * kiggs254/ebiz-app is all a rebuild requires. It replaced an EAS artifact
 * link, which the free plan deletes after 14 days — that link 404'd two days
 * after it expired, with nothing on the page to say why. Only `version` and
 * `sizeMb` are worth refreshing here, and only because they are shown to the
 * reader. NEXT_PUBLIC_EBIZ_APK_URL still wins if it is set.
 */

export const MOBILE_APP = {
  /** Direct download of the current signed APK. */
  apkUrl:
    process.env.NEXT_PUBLIC_EBIZ_APK_URL ??
    "https://github.com/kiggs254/ebiz-app/releases/latest/download/ebiz.apk",
  /** Where every release lives, in case someone wants an older build. */
  buildPageUrl: "https://github.com/kiggs254/ebiz-app/releases",
  version: "0.1.0",
  minAndroid: "7.0",
  sizeMb: 76,
} as const;
