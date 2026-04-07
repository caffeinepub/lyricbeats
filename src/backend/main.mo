import List "mo:core/List";
import Types "types/compositions";
import CompositionsApi "mixins/compositions-api";

actor {
  let compositions = List.empty<Types.Composition>();
  let compositionsState = { var nextCompositionId : Nat = 0 };

  include CompositionsApi(compositions, compositionsState);
};
