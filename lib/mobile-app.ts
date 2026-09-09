/**
 * The E-biz mobile app download.
 *
 * ONE place to change when a new APK is built. Rebuilds are rare — day-to-day
 * changes ship over the air to installed phones via EAS Update, and only a
 * native change (a new native package, a permission, Firebase or Maps keys)
 * needs a fresh binary. When one does, update `apkUrl` and `version` here.
 *
 * CAVEAT: an EAS artifact URL is permanent for the build but the build itself
 * is deleted 30 days after it is made on the free plan, so this link rots
 * around 2026-10-10. Set NEXT_PUBLIC_EBIZ_APK_URL to a self-hosted copy to be
 * free of that; the env var wins over the value below.
 */

export const MOBILE_APP = {
  /** Direct download of the current signed APK. */
  apkUrl:
    process.env.NEXT_PUBLIC_EBIZ_APK_URL ??
    "https://expo.dev/artifacts/eas/LmT4y-6wTbTw_K8sDzpqAk6DvQQFT2IGE5TPNWK4kRI.apk",
  /** The build page, which also renders a QR for installing from a phone. */
  buildPageUrl:
    "https://expo.dev/accounts/kiggs/projects/ebiz-mobile/builds/ecc63c77-bf21-42ea-b2b7-6bc821859d18",
  version: "0.1.0",
  minAndroid: "7.0",
  sizeMb: 134,
} as const;
