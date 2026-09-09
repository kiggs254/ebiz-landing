/**
 * The E-biz mobile app download.
 *
 * ONE place to change when a new APK is built. Rebuilds are rare — day-to-day
 * changes ship over the air to installed phones via EAS Update, and only a
 * native change (a new native package, a permission, Firebase or Maps keys)
 * needs a fresh binary. When one does, update `apkUrl` and `version` here.
 *
 * `apkUrl` points at the EAS build artifact, which is a permanent URL for that
 * build rather than a link that rots when the next one is made.
 */

export const MOBILE_APP = {
  /** Direct download of the current signed APK. */
  apkUrl:
    process.env.NEXT_PUBLIC_EBIZ_APK_URL ??
    "https://expo.dev/accounts/kiggs/projects/ebiz-mobile/builds/latest",
  /** The build page, which also renders a QR for installing from a phone. */
  buildPageUrl: "https://expo.dev/accounts/kiggs/projects/ebiz-mobile/builds",
  version: "0.1.0",
  minAndroid: "7.0",
  sizeMb: 90,
} as const;
