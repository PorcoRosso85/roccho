{
  description = "Hello World HTTP server";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.subflake.url = "path:./sub_javascript_http";

  outputs = { self, nixpkgs, flake-utils, subflake }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          subflakePackage = subflake.packages.${system}.default;
        in
        {
          defaultPackage = pkgs.writeShellScriptBin "run-server" ''
            ${pkgs.nodejs}/bin/node ${./server.js}
            ${subflakePackage}/bin/hello
          '';

          packages.subflake = subflakePackage;
        }
      );
}
