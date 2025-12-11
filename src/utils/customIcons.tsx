import * as React from "react"
import Svg, {
  SvgProps,
  G,
  Path,
  Defs,
  LinearGradient,
  Stop,
  RadialGradient,
  ClipPath,
} from "react-native-svg";
export const LaptopFigure = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={85}
    height={50}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        fill="url(#b)"
        d="M73.025 1.804H12.736v42.163h60.29V1.804Z"
        opacity={0.42}
      />
      <Path
        fill="url(#c)"
        d="M72.463 1.692H12.998v42.164h59.465V1.692Z"
        opacity={0.37}
      />
      <Path fill="#0F0F10" d="M72.266 2.322H13.902v41.08h58.364V2.323Z" />
      <Path
        fill="url(#d)"
        d="M72.334 2.416H13.398v41.08h58.936V2.416Z"
        opacity={0.3}
      />
      <Path fill="url(#e)" d="M72.155 2.28H13.791v41.08h58.364V2.28Z" />
      <Path
        fill="url(#f)"
        d="M73.024 1.374h-61.16v8.472l61.16 9.525V1.374Z"
        opacity={0.07}
        style={{
          mixBlendMode: "overlay",
        }}
      />
      <Path
        fill="url(#g)"
        d="M73.024 1.374h-61.16v6.594l61.16 10.761V1.374Z"
        opacity={0.07}
        style={{
          mixBlendMode: "overlay",
        }}
      />
      <Path fill="#1B171B" d="M72.17 3.47h-59v2.614h59V3.47Z" opacity={0.34} />
      <Path
        fill="url(#h)"
        d="M75.098 42.16v4.998H38.192c-17.508.012-33.568.017-33.568.017s-1.177-.029-.895-.506a.947.947 0 0 1 .218-.23c.083-.07.189-.14.318-.223 1.29-.783 6.593-3.55 8.042-4.303l-.053-.036v-.4h-.024l-.07-.047V1.256s0-.03.011-.07a.96.96 0 0 1 .265-.536c.224-.253.63-.483 1.384-.483h59.07s.065 0 .112.018h.583s.059 0 .147.023c.018 0 .041.018.065.03.276.135.73.635.73 2.437v39.137l-.018.089c.16.064.36.147.595.265l-.006-.006Z"
        opacity={0.15}
        style={{
          mixBlendMode: "multiply",
        }}
      />
      <Path
        fill="url(#i)"
        d="M31.971 48.489a.454.454 0 1 1-.907-.001.454.454 0 0 1 .907 0Z"
      />
      <Path
        fill="url(#j)"
        d="M47.758 48.306c0 .4-.324.724-.724.724H38.91a.729.729 0 0 1-.518-1.242.736.736 0 0 1 .512-.212h8.124c.4 0 .724.324.724.73h.006Z"
      />
      <Path
        fill="url(#k)"
        d="M53.888 48.99H75.04v.453H53.888c-.124 0-.23-.1-.23-.224s.1-.23.23-.23Z"
      />
      <Path
        fill="#585B5B"
        d="M72.927.956h-59.63c-.518 0-.871.1-1.124.23-.566.318-.548.83-.548.83v38.849l.07.041.472.112 1.153.265.578.135 2.843.66.33.076.953.224 2.02.47 2.172.507.206.047.706.165 1.613.377 4.951 1.154 2.414-.206h.088l5.322-.454 1.937-.159.583-.047 3.361-.288 4.469-.377 1.96-.165.577-.047 5.999-.506L62 42.378l4.787-.4 1.76-.148.506-.041 3.203-.27 1.46-.124.023-.112.106-.483V3.346c0-2.567-.93-2.384-.93-2.384l.012-.006ZM71.66 39.605H13.632V3.34h58.023v36.265h.006Z"
      />
      <Path
        fill="url(#l)"
        d="M74.463 1.945c-.047-.606-.16-1.006-.289-1.26-.124-.253-.265-.382-.377-.453-.023-.012-.04-.023-.064-.03-.018-.011-.042-.017-.06-.023-.082-.03-.135-.017-.135-.017H12.614c-1.684 0-1.702 1.095-1.702 1.095v40.179l.053.035.012.012H11l.36.094.67.153.23.053 1.643.389 2.037.477.359.082.235.06.265.064.083.018 1.883.447.165.041.206.047.7.165 1.096.26.489.117.435.1 1.607.377 5.91 1.395 2.261-.194.177-.012.112-.012.365-.03h.041l8.754-.747.818-.07 3.256-.277.565-.047 1.96-.165.825-.07 1.683-.142 1.19-.1 1.365-.118 3.02-.26 1.937-.164.565-.047.46-.041 5.469-.465.112-.012 4.762-.406.247-.018.095-.012.423-.035.095-.012 2.343-.2 2.09-.182.029-.136.023-.118.065-.276.018-.089V2.628c0-.253-.012-.477-.024-.677l-.011-.006Zm-2.226.683v37.507H12.961V2.628h59.276Z"
      />
      <Path
        fill="url(#m)"
        d="M73.191.608H12.955c-.194 0-.365.012-.512.042-1.207.188-1.177 1.036-1.177 1.036v39.55l.07.04h.018l.9.218 1.643.383 2.343.548.348.082 1.448.342 2.148.506.207.047.706.165 1.595.377 6.83 1.6 2.095-.182.124-.012 10.467-.889 2.396-.206.9-.07 2.88-.247 4.42-.377 1.95-.165.57-.047 5.946-.506 5.552-.471 2.19-.183.512-.041 2.72-.236 1.73-.147.094-.441.042-.165V3.034c0-2.614-.942-2.426-.942-2.426h.023ZM13.297 3.034h58.605v36.924H13.297V3.034Z"
      />
      <Path
        fill="url(#n)"
        d="M43.408 1.751a.63.63 0 1 1-1.261-.001.63.63 0 0 1 1.261.001Z"
        opacity={0.55}
      />
      <Path
        fill="url(#o)"
        d="M82.302 46.67c-.412-.012-3.079-.012-7.2-.012-18.326-.012-65.434.012-71.368.012h-.618s-.677-.018-.895-.224c-.141-.135-.077-.359.536-.718 1.312-.771 6.729-3.515 8.206-4.256.236-.124.377-.189.377-.189h62.432s.094-.012.318.047c.1.024.224.065.377.124.011 0 .035.012.052.018.265.1.607.253 1.043.482 1.348.718 8.082 4.039 8.082 4.039s.148.1.2.224c.1.206-.052.482-1.548.453h.006Z"
      />
      <Path
        fill="url(#p)"
        d="m32.807 44.291-.99.99s-.63.494 1.573.447c2.201-.047 20.298 0 20.298 0s1.172-.047.447-.718a70.29 70.29 0 0 1-.806-.766l-20.528.047h.006Z"
      />
      <Path
        fill="url(#q)"
        d="M83.967 48.56c0 1.436-1.213 1.39-1.213 1.39s-74.288-.042-77.344.04c-3.055.095-3.326-.488-3.326-.488v-3.056h1.872l71.15-.206 8.749-.023h.023s.095.9.095 2.343h-.006Z"
      />
      <Path
        fill="url(#r)"
        d="M47.283 47.788a.721.721 0 0 1-.718.719h-8.042a.721.721 0 0 1-.718-.718c0-.395.324-.719.718-.719h8.042c.394 0 .718.324.718.718Z"
      />
      <Path
        fill="url(#s)"
        d="M68.874 41.636s1.325.989 2.09 1.619c.766.624.024.67.024.67s-53.36.048-55.203 0c-1.842-.046-1.165-.358-1.165-.358l2.696-1.884 51.564-.047h-.006Z"
      />
      <Path
        fill="#919799"
        d="m54.123 45.04-.277-.266-.553-.53-.03-.035h-.041l-4.716-.024h-2.978c-.854 0-1.708 0-2.561.012l-2.908.03-2.226.017c-.83.012-1.666.024-2.496.042h-.07c-.837.017-1.673.035-2.508.058h-.065l-.571.548-.442.424s-.035.03-.047.047a.192.192 0 0 0-.047.153c0 .041.03.083.053.106.03.03.07.047.094.07.124.065.253.095.383.112.259.048.518.06.777.071h1.537l3.078.018c2.05.012 4.104 0 6.158-.024 2.049-.03 4.103-.053 6.158-.035l3.079.035c.259 0 .506.012.777 0 .13-.011.265-.035.395-.088a.556.556 0 0 0 .194-.118.333.333 0 0 0 .082-.17v-.077c-.03-.17-.13-.277-.223-.37l-.006-.007Zm-1.625.682-2.673.012c-1.46 0-2.92 0-4.38-.024-.595 0-1.183-.011-1.778-.023-2.054-.036-4.109-.041-6.158-.03-1.03.012-2.054.012-3.078.036l-1.537.03h-.2c-.183 0-.377-.013-.554-.036a1.135 1.135 0 0 1-.323-.077c-.012 0-.024 0-.036-.011-.047-.024-.094-.06-.1-.095-.012-.035.024-.088.065-.123l.012-.012v-.012h.012l.376-.394.071-.071.495-.518h.029c1.601.035 3.197.053 4.804.07h.294l4.398.024h2.926c.983 0 1.96 0 2.943-.012l5.092-.047-.035-.03.07.03h-.035l.53.495c.177.176.424.347.46.524.017.082-.06.147-.171.194-.1.041-.23.07-.348.082-.235.012-.506 0-.76.012h-.4l-.011.006Z"
        opacity={0.72}
      />
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={0.56}
        d="M69.594 42.849H16.422M17.129 42.378h51.788M70.255 43.355H15.89"
      />
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={0.22}
        d="M17.672 41.977h50.71"
      />
      <Path
        fill="url(#t)"
        d="m17.717 41.684-2.56 1.884h55.65l-2.432-1.884H17.717Z"
        opacity={0.56}
      />
      <G
        style={{
          mixBlendMode: "multiply",
        }}
      >
        <Path
          fill="url(#u)"
          d="M73.025 1.804H12.736v42.163h60.29V1.804Z"
          opacity={0.42}
        />
        <Path
          fill="url(#v)"
          d="M72.463 1.692H12.998v42.164h59.465V1.692Z"
          opacity={0.22}
        />
        <Path
          fill="url(#w)"
          d="M73.024 1.374h-61.16v8.472l61.16 9.525V1.374Z"
          opacity={0.07}
          style={{
            mixBlendMode: "overlay",
          }}
        />
        <Path
          fill="url(#x)"
          d="M73.024 1.374h-61.16v6.594l61.16 10.761V1.374Z"
          opacity={0.07}
          style={{
            mixBlendMode: "overlay",
          }}
        />
        <Path
          fill="url(#y)"
          d="M31.97 48.489a.453.453 0 1 1-.908 0 .453.453 0 0 1 .907 0Z"
        />
        <Path
          fill="url(#z)"
          d="M47.756 48.306c0 .4-.324.724-.724.724h-8.124a.729.729 0 0 1-.518-1.242.736.736 0 0 1 .512-.212h8.124c.4 0 .724.324.724.73h.006Z"
        />
        <Path
          fill="url(#A)"
          d="M53.886 48.99h21.152v.453H53.886c-.124 0-.23-.1-.23-.224s.1-.23.23-.23Z"
        />
        <Path
          fill="#585B5B"
          d="M72.925.956h-59.63c-.518 0-.871.1-1.124.23-.566.318-.548.83-.548.83v38.849l.07.041.472.112 1.154.265.576.135 2.844.66.33.076.953.224 2.02.47 2.172.507.206.047.706.165 1.613.377 4.951 1.154 2.414-.206h.088l5.322-.454 1.937-.159.583-.047 3.361-.288 4.469-.377 1.96-.165.577-.047 5.999-.506 5.598-.471 4.787-.4 1.76-.148.506-.041 3.203-.27 1.46-.124.023-.112.106-.483V3.346c0-2.567-.93-2.384-.93-2.384l.012-.006Zm-1.266 38.649H13.631V3.34h58.022v36.265h.006Z"
        />
        <Path
          fill="url(#B)"
          d="M74.46 1.945c-.046-.606-.158-1.006-.288-1.26-.123-.253-.265-.382-.377-.453-.023-.012-.04-.023-.064-.03-.018-.011-.041-.017-.06-.023-.082-.03-.135-.017-.135-.017H12.611c-1.683 0-1.7 1.095-1.7 1.095v40.179l.052.035.012.012h.024l.359.094.67.153.23.053 1.643.389 2.037.477.359.082.235.06.265.064.083.018 1.884.447.164.041.206.047.7.165 1.096.26.489.117.435.1 1.607.377 5.91 1.395 2.262-.194.176-.012.112-.012.365-.03h.041l8.754-.747.819-.07 3.255-.277.565-.047 1.96-.165.825-.07 1.683-.142 1.19-.1 1.365-.118 3.02-.26 1.937-.164.565-.047.46-.041 5.469-.465.111-.012 4.763-.406.247-.018.095-.012.423-.035.095-.012 2.343-.2 2.09-.182.029-.136.024-.118.064-.276.018-.089V2.628c0-.253-.012-.477-.024-.677l-.011-.006Zm-2.225.683v37.507H12.96V2.628h59.276Z"
        />
        <Path
          fill="url(#C)"
          d="M73.191.608H12.955c-.194 0-.365.012-.512.042-1.207.188-1.177 1.036-1.177 1.036v39.55l.07.04h.018l.9.218 1.643.383 2.343.548.348.082 1.448.342 2.148.506.207.047.706.165 1.595.377 6.83 1.6 2.095-.182.124-.012 10.467-.889 2.396-.206.9-.07 2.88-.247 4.42-.377 1.95-.165.57-.047 5.946-.506 5.552-.471 2.19-.183.512-.041 2.72-.236 1.73-.147.094-.441.042-.165V3.034c0-2.614-.942-2.426-.942-2.426h.023ZM13.297 3.034h58.605v36.924H13.297V3.034Z"
        />
        <Path
          fill="url(#D)"
          d="M43.406 1.751a.63.63 0 1 1-1.261-.001.63.63 0 0 1 1.261.001Z"
          opacity={0.55}
        />
        <Path
          fill="url(#E)"
          d="M82.3 46.67c-.412-.012-3.079-.012-7.2-.012-18.326-.012-65.434.012-71.368.012h-.618s-.677-.018-.895-.224c-.141-.135-.077-.359.536-.718 1.313-.771 6.729-3.515 8.206-4.256.236-.124.377-.189.377-.189H73.77s.094-.012.318.047c.1.024.224.065.377.124.011 0 .035.012.053.018.264.1.606.253 1.042.482 1.348.718 8.082 4.039 8.082 4.039s.148.1.2.224c.1.206-.052.482-1.548.453h.006Z"
        />
        <Path
          fill="url(#F)"
          d="m32.805 44.291-.99.99s-.63.494 1.573.447c2.201-.047 20.298 0 20.298 0s1.172-.047.448-.718a70.29 70.29 0 0 1-.807-.766l-20.528.047h.006Z"
        />
        <Path
          fill="url(#G)"
          d="M83.965 48.56c0 1.436-1.213 1.39-1.213 1.39s-74.288-.042-77.344.04c-3.055.095-3.326-.488-3.326-.488v-3.056h1.872l71.15-.206 8.749-.023h.023s.095.9.095 2.343h-.006Z"
        />
        <Path
          fill="url(#H)"
          d="M47.283 47.788a.721.721 0 0 1-.718.719h-8.042a.721.721 0 0 1-.718-.718c0-.395.324-.719.718-.719h8.042c.394 0 .718.324.718.718Z"
        />
        <Path
          fill="url(#I)"
          d="M68.874 41.636s1.325.989 2.09 1.619c.766.624.024.67.024.67s-53.36.048-55.203 0c-1.842-.046-1.165-.358-1.165-.358l2.696-1.884 51.564-.047h-.006Z"
        />
        <Path
          fill="#919799"
          d="m54.12 45.04-.276-.266-.553-.53-.03-.035h-.041l-4.716-.024h-2.978c-.854 0-1.708 0-2.561.012l-2.909.03-2.225.017c-.83.012-1.666.024-2.496.042h-.07c-.837.017-1.672.035-2.508.058h-.065l-.571.548-.442.424s-.035.03-.047.047a.193.193 0 0 0-.047.153c0 .041.03.083.053.106.03.03.07.047.094.07.124.065.253.095.383.112.259.048.518.06.777.071h1.536l3.08.018c2.048.012 4.103 0 6.157-.024 2.049-.03 4.104-.053 6.158-.035l3.079.035c.26 0 .506.012.777 0 .13-.011.265-.035.395-.088a.556.556 0 0 0 .194-.118.332.332 0 0 0 .082-.17v-.077c-.03-.17-.13-.277-.224-.37l-.005-.007Zm-1.624.682-2.673.012c-1.46 0-2.92 0-4.38-.024-.594 0-1.183-.011-1.778-.023-2.054-.036-4.109-.041-6.157-.03-1.03.012-2.055.012-3.08.036l-1.536.03h-.2c-.183 0-.377-.013-.553-.036a1.135 1.135 0 0 1-.324-.077c-.012 0-.024 0-.036-.011-.047-.024-.094-.06-.1-.095-.011-.035.024-.088.065-.123l.012-.012v-.012h.012l.376-.394.071-.071.494-.518h.03c1.601.035 3.197.053 4.804.07h.294l4.398.024h2.926c.983 0 1.96 0 2.943-.012l5.092-.047-.035-.03.07.03h-.035l.53.495c.177.176.424.347.46.524.017.082-.06.147-.171.194-.1.041-.23.07-.348.082-.235.012-.506 0-.76.012h-.4l-.011.006Z"
          opacity={0.72}
        />
        <Path
          stroke="#fff"
          strokeLinecap="round"
          strokeMiterlimit={10}
          strokeWidth={0.56}
          d="M69.594 42.849H16.422M17.127 42.378h51.788M70.253 43.355H15.887"
        />
        <Path
          stroke="#fff"
          strokeLinecap="round"
          strokeMiterlimit={10}
          strokeWidth={0.22}
          d="M17.672 41.977h50.71"
        />
        <Path
          fill="url(#J)"
          d="m17.715 41.684-2.56 1.884h55.65l-2.432-1.884H17.715Z"
          opacity={0.56}
        />
      </G>
      <Path
        fill="url(#K)"
        d="M83.794 46.057h-.023c-.053-.123-.2-.224-.2-.224s-6.735-3.32-8.083-4.038a7.986 7.986 0 0 0-1.042-.483V2.51c0-1.801-.453-2.302-.73-2.437-.024-.012-.041-.024-.065-.03-.018-.011-.041-.017-.059-.023-.082-.03-.135-.018-.135-.018H12.532c-1.684 0-1.701 1.095-1.701 1.095v40.18l.053.035c-1.478.742-6.894 3.485-8.207 4.257-.612.359-.677.582-.536.718H2v3.055s.27.583 3.326.489c3.056-.089 77.344-.041 77.344-.041s1.213.047 1.213-1.39c0-1.436-.094-2.343-.094-2.343h.005Zm-29.87-.594c-.1.04-.23.07-.348.082-.235.012-.506 0-.76.012h-.4l-2.672.011c-1.46 0-2.92 0-4.38-.023-.595 0-1.183-.012-1.778-.024-2.055-.035-4.11-.04-6.158-.029-1.03.012-2.054.012-3.079.035l-1.536.03h-.2c-.183 0-.377-.012-.554-.036a1.131 1.131 0 0 1-.324-.076c-.011 0-.023 0-.035-.012-.047-.023-.094-.059-.1-.094-.012-.035.023-.088.065-.124l.012-.012v-.011h.011l.377-.395.07-.07.495-.518h.03c1.6.035 3.196.053 4.804.07h.294l4.397.024h2.926c.983 0 1.96 0 2.944-.012l5.092-.047.53.495c.177.176.424.347.46.523.017.083-.06.148-.172.195l-.011.006Zm-38.849-2.055 2.561-1.884h50.658l2.425 1.884H15.075Zm56.504-3.962H13.556V3.18H71.58v36.265Z"
        opacity={0.32}
        style={{
          mixBlendMode: "overlay",
        }}
      />
    </G>
    <Defs>
      <LinearGradient
        id="b"
        x1={12.736}
        x2={73.355}
        y1={22.885}
        y2={22.885}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#1B171B" />
        <Stop offset={1} stopColor="#1B171B" />
      </LinearGradient>
      <LinearGradient
        id="c"
        x1={12.998}
        x2={72.463}
        y1={22.774}
        y2={22.774}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#1B171B" />
        <Stop offset={1} stopColor="#1B171B" />
      </LinearGradient>
      <LinearGradient
        id="d"
        x1={13.398}
        x2={72.334}
        y1={22.956}
        y2={22.956}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#fff" />
        <Stop offset={0.94} stopColor="#fff" />
        <Stop offset={1} stopColor="#fff" />
      </LinearGradient>
      <LinearGradient
        id="f"
        x1={-1.786}
        x2={86.832}
        y1={11.265}
        y2={9.532}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0.01} stopColor="#fff" />
        <Stop offset={0.63} stopColor="#fff" />
        <Stop offset={0.67} stopColor="#fff" />
      </LinearGradient>
      <LinearGradient
        id="g"
        x1={-0.205}
        x2={86.787}
        y1={10.052}
        y2={10.052}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0.01} stopColor="#fff" />
        <Stop offset={0.63} stopColor="#fff" />
        <Stop offset={0.67} stopColor="#fff" />
      </LinearGradient>
      <LinearGradient
        id="h"
        x1={39.393}
        x2={39.393}
        y1={0.956}
        y2={46.652}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#986E50" />
        <Stop offset={0.23} stopColor="#997157" />
        <Stop offset={0.57} stopColor="#9D7A6B" />
        <Stop offset={0.98} stopColor="#A4898D" />
        <Stop offset={1} stopColor="#A58A8F" />
      </LinearGradient>
      <LinearGradient
        id="i"
        x1={31.518}
        x2={31.518}
        y1={48.053}
        y2={48.936}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#A37442" />
        <Stop offset={0.94} stopColor="#A1757B" />
        <Stop offset={1} stopColor="#A17680" />
      </LinearGradient>
      <LinearGradient
        id="j"
        x1={42.972}
        x2={42.972}
        y1={47.606}
        y2={49.013}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#A37442" />
        <Stop offset={0.94} stopColor="#A1757B" />
        <Stop offset={1} stopColor="#A17680" />
      </LinearGradient>
      <LinearGradient
        id="k"
        x1={64.355}
        x2={64.355}
        y1={48.995}
        y2={49.437}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#A37442" />
        <Stop offset={0.94} stopColor="#A1757B" />
        <Stop offset={1} stopColor="#A17680" />
      </LinearGradient>
      <LinearGradient
        id="l"
        x1={42.702}
        x2={42.702}
        y1={4.383}
        y2={54.017}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#76797D" />
        <Stop offset={0.5} stopColor="#90959A" />
        <Stop offset={1} stopColor="#9DA4AB" />
      </LinearGradient>
      <LinearGradient
        id="m"
        x1={42.697}
        x2={42.697}
        y1={4.759}
        y2={53.616}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#9DA4AB" />
        <Stop offset={0.5} stopColor="#90959A" />
        <Stop offset={1} stopColor="#76797D" />
      </LinearGradient>
      <LinearGradient
        id="o"
        x1={2.162}
        x2={83.874}
        y1={43.974}
        y2={43.974}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#9DA4AB" />
        <Stop offset={0.5} stopColor="#90959A" />
        <Stop offset={1} stopColor="#76797D" />
      </LinearGradient>
      <LinearGradient
        id="p"
        x1={31.735}
        x2={54.377}
        y1={44.986}
        y2={44.986}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#71767C" />
        <Stop offset={0.28} stopColor="#777C80" />
        <Stop offset={0.68} stopColor="#686A74" />
      </LinearGradient>
      <LinearGradient
        id="q"
        x1={2.084}
        x2={83.967}
        y1={48.112}
        y2={48.112}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#76797D" />
        <Stop offset={0.5} stopColor="#90959A" />
        <Stop offset={1} stopColor="#9DA4AB" />
      </LinearGradient>
      <LinearGradient
        id="r"
        x1={42.55}
        x2={42.55}
        y1={47.117}
        y2={48.995}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#4D4F53" />
        <Stop offset={0.5} stopColor="#90959A" />
        <Stop offset={1} stopColor="#242628" />
      </LinearGradient>
      <LinearGradient
        id="s"
        x1={42.901}
        x2={42.901}
        y1={44.138}
        y2={41.3}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#333434" />
        <Stop offset={0.33} stopColor="#63686C" />
        <Stop offset={0.5} stopColor="#798086" />
        <Stop offset={0.72} stopColor="#777E84" />
        <Stop offset={0.81} stopColor="#71777D" />
        <Stop offset={0.87} stopColor="#666B71" />
        <Stop offset={0.92} stopColor="#565B60" />
        <Stop offset={0.96} stopColor="#43464A" />
        <Stop offset={1} stopColor="#28292C" />
      </LinearGradient>
      <LinearGradient
        id="t"
        x1={42.978}
        x2={42.978}
        y1={41.036}
        y2={45.01}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#333434" />
        <Stop offset={0.33} stopColor="#63686C" />
        <Stop offset={0.5} stopColor="#798086" />
        <Stop offset={0.72} stopColor="#777E84" />
        <Stop offset={0.81} stopColor="#71777D" />
        <Stop offset={0.87} stopColor="#666B71" />
        <Stop offset={0.92} stopColor="#565B60" />
        <Stop offset={0.96} stopColor="#43464A" />
        <Stop offset={1} stopColor="#28292C" />
      </LinearGradient>
      <LinearGradient
        id="u"
        x1={12.736}
        x2={73.355}
        y1={22.885}
        y2={22.885}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#1B171B" />
        <Stop offset={1} stopColor="#1B171B" />
      </LinearGradient>
      <LinearGradient
        id="v"
        x1={12.998}
        x2={72.463}
        y1={22.774}
        y2={22.774}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#1B171B" />
        <Stop offset={1} stopColor="#1B171B" />
      </LinearGradient>
      <LinearGradient
        id="w"
        x1={-1.786}
        x2={86.832}
        y1={11.265}
        y2={9.532}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0.01} stopColor="#fff" />
        <Stop offset={0.63} stopColor="#fff" />
        <Stop offset={0.67} stopColor="#fff" />
      </LinearGradient>
      <LinearGradient
        id="x"
        x1={-0.205}
        x2={86.787}
        y1={10.052}
        y2={10.052}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0.01} stopColor="#fff" />
        <Stop offset={0.63} stopColor="#fff" />
        <Stop offset={0.67} stopColor="#fff" />
      </LinearGradient>
      <LinearGradient
        id="y"
        x1={31.516}
        x2={31.516}
        y1={48.053}
        y2={48.936}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#A37442" />
        <Stop offset={0.94} stopColor="#A1757B" />
        <Stop offset={1} stopColor="#A17680" />
      </LinearGradient>
      <LinearGradient
        id="z"
        x1={42.97}
        x2={42.97}
        y1={47.606}
        y2={49.013}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#A37442" />
        <Stop offset={0.94} stopColor="#A1757B" />
        <Stop offset={1} stopColor="#A17680" />
      </LinearGradient>
      <LinearGradient
        id="A"
        x1={64.353}
        x2={64.353}
        y1={48.995}
        y2={49.437}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#A37442" />
        <Stop offset={0.94} stopColor="#A1757B" />
        <Stop offset={1} stopColor="#A17680" />
      </LinearGradient>
      <LinearGradient
        id="B"
        x1={42.7}
        x2={42.7}
        y1={4.383}
        y2={54.017}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#76797D" />
        <Stop offset={0.5} stopColor="#90959A" />
        <Stop offset={1} stopColor="#9DA4AB" />
      </LinearGradient>
      <LinearGradient
        id="C"
        x1={42.697}
        x2={42.697}
        y1={4.759}
        y2={53.616}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#9DA4AB" />
        <Stop offset={0.5} stopColor="#90959A" />
        <Stop offset={1} stopColor="#76797D" />
      </LinearGradient>
      <LinearGradient
        id="E"
        x1={2.16}
        x2={83.872}
        y1={43.974}
        y2={43.974}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#9DA4AB" />
        <Stop offset={0.5} stopColor="#90959A" />
        <Stop offset={1} stopColor="#76797D" />
      </LinearGradient>
      <LinearGradient
        id="F"
        x1={31.733}
        x2={54.375}
        y1={44.986}
        y2={44.986}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#71767C" />
        <Stop offset={0.28} stopColor="#777C80" />
        <Stop offset={0.68} stopColor="#686A74" />
      </LinearGradient>
      <LinearGradient
        id="G"
        x1={2.082}
        x2={83.965}
        y1={48.112}
        y2={48.112}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#76797D" />
        <Stop offset={0.5} stopColor="#90959A" />
        <Stop offset={1} stopColor="#9DA4AB" />
      </LinearGradient>
      <LinearGradient
        id="H"
        x1={42.55}
        x2={42.55}
        y1={47.117}
        y2={48.995}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#4D4F53" />
        <Stop offset={0.5} stopColor="#90959A" />
        <Stop offset={1} stopColor="#242628" />
      </LinearGradient>
      <LinearGradient
        id="I"
        x1={42.901}
        x2={42.901}
        y1={44.138}
        y2={41.3}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#333434" />
        <Stop offset={0.33} stopColor="#63686C" />
        <Stop offset={0.5} stopColor="#798086" />
        <Stop offset={0.72} stopColor="#777E84" />
        <Stop offset={0.81} stopColor="#71777D" />
        <Stop offset={0.87} stopColor="#666B71" />
        <Stop offset={0.92} stopColor="#565B60" />
        <Stop offset={0.96} stopColor="#43464A" />
        <Stop offset={1} stopColor="#28292C" />
      </LinearGradient>
      <LinearGradient
        id="J"
        x1={42.976}
        x2={42.976}
        y1={41.036}
        y2={45.01}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#333434" />
        <Stop offset={0.33} stopColor="#63686C" />
        <Stop offset={0.5} stopColor="#798086" />
        <Stop offset={0.72} stopColor="#777E84" />
        <Stop offset={0.81} stopColor="#71777D" />
        <Stop offset={0.87} stopColor="#666B71" />
        <Stop offset={0.92} stopColor="#565B60" />
        <Stop offset={0.96} stopColor="#43464A" />
        <Stop offset={1} stopColor="#28292C" />
      </LinearGradient>
      <LinearGradient
        id="K"
        x1={42.944}
        x2={42.944}
        y1={49.837}
        y2={-0.004}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#1B171B" />
        <Stop offset={0.12} stopColor="#3F3C3F" />
        <Stop offset={0.45} stopColor="#A5A4A5" />
        <Stop offset={0.68} stopColor="#E5E5E5" />
        <Stop offset={0.79} stopColor="#fff" />
      </LinearGradient>
      <RadialGradient
        id="e"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="matrix(0 55.0161 -53.413 0 84.312 -14.05)"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#A9A8A8" />
        <Stop offset={0.2} stopColor="#A9A8A8" />
        <Stop offset={0.88} stopColor="#A9A8A8" />
      </RadialGradient>
      <RadialGradient
        id="n"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="matrix(.62991 0 0 .62992 42.778 1.751)"
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0.21} stopColor="#535354" />
        <Stop offset={0.31} stopColor="#454546" />
        <Stop offset={0.51} stopColor="#303031" />
        <Stop offset={0.71} stopColor="#242425" />
        <Stop offset={0.9} stopColor="#202021" />
      </RadialGradient>
      <RadialGradient
        id="D"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="matrix(.62991 0 0 .62992 42.776 1.751)"
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0.21} stopColor="#535354" />
        <Stop offset={0.31} stopColor="#454546" />
        <Stop offset={0.51} stopColor="#303031" />
        <Stop offset={0.71} stopColor="#242425" />
        <Stop offset={0.9} stopColor="#202021" />
      </RadialGradient>
      <ClipPath id="a">
        <Path fill="#fff" d="M2 0h81.973v50.001H2z" />
      </ClipPath>
    </Defs>
  </Svg>
);

