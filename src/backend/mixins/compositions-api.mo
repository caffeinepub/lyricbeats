import List "mo:core/List";
import Time "mo:core/Time";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Types "../types/compositions";
import CompositionsLib "../lib/compositions";

mixin (
  compositions : List.List<Types.Composition>,
  state : { var nextCompositionId : Nat },
) {

  // AI music generation endpoint — configure to your AI service URL
  let AI_MUSIC_API_URL : Text = "https://api.example.com/generate-music";

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared func createComposition(req : Types.CreateCompositionRequest) : async Types.Composition {
    let id = state.nextCompositionId;
    state.nextCompositionId += 1;
    let now = Time.now();
    let composition = CompositionsLib.create(compositions, id, req, now);

    // Call AI music generation API — fire and forget style, update audioUrl when done
    let requestBody = "{\"title\":\"" # req.title # "\",\"lyrics\":\"" # req.lyrics # "\"}";
    let headers : [OutCall.Header] = [
      { name = "Content-Type"; value = "application/json" },
    ];
    let audioUrl = await OutCall.httpPostRequest(AI_MUSIC_API_URL, headers, requestBody, transform);
    ignore CompositionsLib.setAudioUrl(compositions, id, audioUrl);

    // Return composition with updated audioUrl
    switch (CompositionsLib.get(compositions, id)) {
      case (?c) c;
      case null composition;
    };
  };

  public query func listCompositions() : async [Types.Composition] {
    CompositionsLib.list(compositions);
  };

  public query func getComposition(id : Types.CompositionId) : async ?Types.Composition {
    CompositionsLib.get(compositions, id);
  };

  public shared func deleteComposition(id : Types.CompositionId) : async Bool {
    CompositionsLib.delete(compositions, id);
  };

  public shared func updateCompositionTitle(id : Types.CompositionId, title : Text) : async Bool {
    CompositionsLib.updateTitle(compositions, id, title);
  };
};
